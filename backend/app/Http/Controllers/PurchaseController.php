<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequest;
use App\Http\Requests\UpdatePurchaseRequest;
use App\Http\Resources\PurchaseResource;
use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],

            'supplier_id' => [
                'nullable',
                'integer',
                'exists:suppliers,id',
            ],

            'receipt_status' => [
                'nullable',
                Rule::in([
                    'draft',
                    'ordered',
                    'received',
                    'cancelled',
                ]),
            ],

            'payment_status' => [
                'nullable',
                Rule::in([
                    'unpaid',
                    'partial',
                    'paid',
                ]),
            ],

            'date_from' => [
                'nullable',
                'date',
            ],

            'date_to' => [
                'nullable',
                'date',
                'after_or_equal:date_from',
            ],

            'per_page' => [
                'nullable',
                'integer',
                'min:5',
                'max:50',
            ],
        ]);

        $search = $validated['search'] ?? null;
        $supplierId = $validated['supplier_id'] ?? null;
        $receiptStatus = $validated['receipt_status'] ?? null;
        $paymentStatus = $validated['payment_status'] ?? null;
        $dateFrom = $validated['date_from'] ?? null;
        $dateTo = $validated['date_to'] ?? null;
        $perPage = $validated['per_page'] ?? 10;

        $purchases = Purchase::query()
            ->with('supplier')
            ->withCount('items')
            ->when(
                $supplierId,
                fn ($query, $supplierId) => $query
                    ->where('supplier_id', $supplierId)
            )
            ->when(
                $receiptStatus,
                fn ($query, $receiptStatus) => $query
                    ->where('receipt_status', $receiptStatus)
            )
            ->when(
                $paymentStatus,
                fn ($query, $paymentStatus) => $query
                    ->where('payment_status', $paymentStatus)
            )
            ->when(
                $dateFrom,
                fn ($query, $dateFrom) => $query
                    ->whereDate('purchase_date', '>=', $dateFrom)
            )
            ->when(
                $dateTo,
                fn ($query, $dateTo) => $query
                    ->whereDate('purchase_date', '<=', $dateTo)
            )
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where(
                            'purchase_no',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'notes',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhereHas(
                            'supplier',
                            function ($supplierQuery) use ($search) {
                                $supplierQuery->where(
                                    'name',
                                    'like',
                                    "%{$search}%"
                                );
                            }
                        )
                        ->orWhereHas(
                            'items',
                            function ($itemQuery) use ($search) {
                                $itemQuery
                                    ->where(
                                        'product_name',
                                        'like',
                                        "%{$search}%"
                                    )
                                    ->orWhere(
                                        'product_sku',
                                        'like',
                                        "%{$search}%"
                                    );
                            }
                        );
                });
            })
            ->orderByDesc('purchase_date')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return PurchaseResource::collection($purchases);
    }

    public function store(StorePurchaseRequest $request)
    {
        $data = $request->validated();

        $purchase = DB::transaction(function () use ($data) {
            $supplier = Supplier::query()
                ->lockForUpdate()
                ->find($data['supplier_id']);

            if (! $supplier || ! $supplier->is_active) {
                throw ValidationException::withMessages([
                    'supplier_id' => [
                        'The selected supplier is inactive or no longer exists.',
                    ],
                ]);
            }

            $requestedItems = collect($data['items']);

            $productIds = $requestedItems
                ->pluck('product_id')
                ->sort()
                ->values();

            $products = Product::query()
                ->whereIn('id', $productIds)
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            if ($products->count() !== $productIds->count()) {
                throw ValidationException::withMessages([
                    'items' => [
                        'One or more selected products no longer exist.',
                    ],
                ]);
            }

            $preparedItems = [];
            $totalAmountInCents = 0;

            foreach ($requestedItems as $index => $requestedItem) {
                $product = $products->get(
                    $requestedItem['product_id']
                );

                if (! $product->is_active) {
                    throw ValidationException::withMessages([
                        "items.{$index}.product_id" => [
                            "{$product->name} is inactive and cannot be purchased.",
                        ],
                    ]);
                }

                $quantity = (int) $requestedItem['quantity'];

                $unitCostInCents = $this->moneyToCents(
                    $requestedItem['unit_cost']
                );

                $subtotalInCents =
                    $unitCostInCents * $quantity;

                $preparedItems[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'unit_cost' => $unitCostInCents / 100,
                    'subtotal' => $subtotalInCents / 100,
                ];

                $totalAmountInCents += $subtotalInCents;
            }

            $paidAmountInCents = $this->moneyToCents(
                $data['paid_amount']
            );

            if ($paidAmountInCents > $totalAmountInCents) {
                throw ValidationException::withMessages([
                    'paid_amount' => [
                        'Paid amount cannot exceed the purchase total.',
                    ],
                ]);
            }

            $paymentStatus = match (true) {
                $paidAmountInCents === 0 => 'unpaid',
                $paidAmountInCents === $totalAmountInCents => 'paid',
                default => 'partial',
            };

            $purchase = Purchase::create([
                'purchase_no' => $this->generatePurchaseNumber(),
                'purchase_date' => $data['purchase_date'],
                'supplier_id' => $supplier->id,
                'receipt_status' => $data['receipt_status'],
                'payment_status' => $paymentStatus,
                'paid_amount' => $paidAmountInCents / 100,
                'total_amount' => $totalAmountInCents / 100,
                'notes' => $data['notes'] ?? null,
                'received_at' => null,
            ]);

            foreach ($preparedItems as $preparedItem) {
                $product = $preparedItem['product'];

                $purchase->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $preparedItem['quantity'],
                    'unit_cost' => $preparedItem['unit_cost'],
                    'subtotal' => $preparedItem['subtotal'],
                ]);
            }

            return $purchase;
        });

        $purchase
            ->load([
                'supplier',
                'items',
            ])
            ->loadCount('items');

        return (new PurchaseResource($purchase))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }


    public function update(
        UpdatePurchaseRequest $request,
        Purchase $purchase
    ) {
        $data = $request->validated();

        $updatedPurchase = DB::transaction(
            function () use ($data, $purchase) {
                $lockedPurchase = Purchase::query()
                    ->lockForUpdate()
                    ->findOrFail($purchase->id);

                if (
                    in_array(
                        $lockedPurchase->receipt_status,
                        [
                            'received',
                            'cancelled',
                        ],
                        true
                    )
                ) {
                    throw ValidationException::withMessages([
                        'receipt_status' => [
                            'Received or cancelled purchase cannot be edited.',
                        ],
                    ]);
                }

                $supplier = Supplier::query()
                    ->lockForUpdate()
                    ->find($data['supplier_id']);

                if (
                    ! $supplier
                    || ! $supplier->is_active
                ) {
                    throw ValidationException::withMessages([
                        'supplier_id' => [
                            'The selected supplier is inactive or no longer exists.',
                        ],
                    ]);
                }

                $requestedItems = collect(
                    $data['items']
                );

                $productIds = $requestedItems
                    ->pluck('product_id')
                    ->sort()
                    ->values();

                $products = Product::query()
                    ->whereIn('id', $productIds)
                    ->orderBy('id')
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');

                if (
                    $products->count()
                    !== $productIds->count()
                ) {
                    throw ValidationException::withMessages([
                        'items' => [
                            'One or more selected products no longer exist.',
                        ],
                    ]);
                }

                $preparedItems = [];
                $totalAmountInCents = 0;

                foreach (
                    $requestedItems as $index => $requestedItem
                ) {
                    $product = $products->get(
                        $requestedItem['product_id']
                    );

                    if (! $product->is_active) {
                        throw ValidationException::withMessages([
                            "items.{$index}.product_id" => [
                                "{$product->name} is inactive and cannot be purchased.",
                            ],
                        ]);
                    }

                    $quantity = (int) $requestedItem['quantity'];

                    $unitCostInCents = $this->moneyToCents(
                        $requestedItem['unit_cost']
                    );

                    $subtotalInCents =
                        $unitCostInCents * $quantity;

                    $preparedItems[] = [
                        'product' => $product,
                        'quantity' => $quantity,
                        'unit_cost' =>
                            $unitCostInCents / 100,
                        'subtotal' =>
                            $subtotalInCents / 100,
                    ];

                    $totalAmountInCents +=
                        $subtotalInCents;
                }

                $paidAmountInCents = $this->moneyToCents(
                    $data['paid_amount']
                );

                if (
                    $paidAmountInCents
                    > $totalAmountInCents
                ) {
                    throw ValidationException::withMessages([
                        'paid_amount' => [
                            'Paid amount cannot exceed the purchase total.',
                        ],
                    ]);
                }

                $paymentStatus = match (true) {
                    $paidAmountInCents === 0 =>
                        'unpaid',

                    $paidAmountInCents
                        === $totalAmountInCents =>
                        'paid',

                    default =>
                        'partial',
                };

                $lockedPurchase->update([
                    'purchase_date' =>
                        $data['purchase_date'],
                    'supplier_id' =>
                        $supplier->id,
                    'receipt_status' =>
                        $data['receipt_status'],
                    'payment_status' =>
                        $paymentStatus,
                    'paid_amount' =>
                        $paidAmountInCents / 100,
                    'total_amount' =>
                        $totalAmountInCents / 100,
                    'notes' =>
                        $data['notes'] ?? null,
                ]);

                $lockedPurchase->items()->delete();

                foreach ($preparedItems as $preparedItem) {
                    $product = $preparedItem['product'];

                    $lockedPurchase->items()->create([
                        'product_id' =>
                            $product->id,
                        'product_name' =>
                            $product->name,
                        'product_sku' =>
                            $product->sku,
                        'quantity' =>
                            $preparedItem['quantity'],
                        'unit_cost' =>
                            $preparedItem['unit_cost'],
                        'subtotal' =>
                            $preparedItem['subtotal'],
                    ]);
                }

                return $lockedPurchase;
            }
        );

        $updatedPurchase
            ->load([
                'supplier',
                'items',
            ])
            ->loadCount('items');

        return new PurchaseResource(
            $updatedPurchase
        );
    }

    public function show(Purchase $purchase)
    {
        $purchase
            ->load([
                'supplier',
                'items',
            ])
            ->loadCount('items');

        return new PurchaseResource($purchase);
    }



    public function cancel(Purchase $purchase)
    {
        $cancelledPurchase = DB::transaction(
            function () use ($purchase) {
                $lockedPurchase = Purchase::query()
                    ->with([
                        'supplier',
                        'items',
                    ])
                    ->lockForUpdate()
                    ->findOrFail($purchase->id);

                if (
                    $lockedPurchase->receipt_status
                    === 'received'
                ) {
                    throw ValidationException::withMessages([
                        'receipt_status' => [
                            'Received purchase cannot be cancelled.',
                        ],
                    ]);
                }

                if (
                    $lockedPurchase->receipt_status
                    !== 'cancelled'
                ) {
                    $lockedPurchase->update([
                        'receipt_status' => 'cancelled',
                    ]);
                }

                return $lockedPurchase;
            }
        );

        $cancelledPurchase
            ->load([
                'supplier',
                'items',
            ])
            ->loadCount('items');

        return new PurchaseResource(
            $cancelledPurchase
        );
    }

    public function receive(Purchase $purchase)
    {
        $receivedPurchase = DB::transaction(
            function () use ($purchase) {
                $lockedPurchase = Purchase::query()
                    ->with([
                        'supplier',
                        'items',
                    ])
                    ->lockForUpdate()
                    ->findOrFail($purchase->id);

                if (
                    $lockedPurchase->receipt_status
                    === 'received'
                ) {
                    return $lockedPurchase;
                }

                if (
                    $lockedPurchase->receipt_status
                    === 'cancelled'
                ) {
                    throw ValidationException::withMessages([
                        'receipt_status' => [
                            'Cancelled purchase cannot be received.',
                        ],
                    ]);
                }

                if ($lockedPurchase->items->isEmpty()) {
                    throw ValidationException::withMessages([
                        'items' => [
                            'Purchase does not contain any items.',
                        ],
                    ]);
                }

                if (
                    $lockedPurchase->items
                        ->contains(
                            fn ($item) => $item->product_id === null
                        )
                ) {
                    throw ValidationException::withMessages([
                        'items' => [
                            'One or more purchase products no longer exist.',
                        ],
                    ]);
                }

                $productIds = $lockedPurchase->items
                    ->pluck('product_id')
                    ->unique()
                    ->sort()
                    ->values();

                $products = Product::query()
                    ->whereIn('id', $productIds)
                    ->orderBy('id')
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');

                if (
                    $products->count()
                    !== $productIds->count()
                ) {
                    throw ValidationException::withMessages([
                        'items' => [
                            'One or more purchase products no longer exist.',
                        ],
                    ]);
                }

                foreach (
                    $lockedPurchase->items as $item
                ) {
                    $product = $products->get(
                        $item->product_id
                    );

                    $quantity = (int) $item->quantity;
                    $stockBefore = (int) $product->stock;
                    $stockAfter = $stockBefore + $quantity;

                    $currentCostInCents = $this->moneyToCents(
                        $product->purchase_price
                    );

                    $incomingCostInCents = $this->moneyToCents(
                        $item->unit_cost
                    );

                    $existingStockValue =
                        $stockBefore * $currentCostInCents;

                    $incomingStockValue =
                        $quantity * $incomingCostInCents;

                    $averageCostInCents = (int) round(
                        (
                            $existingStockValue
                            + $incomingStockValue
                        ) / $stockAfter
                    );

                    $product->update([
                        'stock' => $stockAfter,
                        'purchase_price' =>
                            $averageCostInCents / 100,
                    ]);

                    InventoryMovement::create([
                        'product_id' => $product->id,
                        'type' => 'stock_in',
                        'quantity' => $quantity,
                        'stock_before' => $stockBefore,
                        'stock_after' => $stockAfter,
                        'reference_no' =>
                            $lockedPurchase->purchase_no,
                        'note' =>
                            'Purchase from '
                            .$lockedPurchase->supplier->name
                            .'.',
                    ]);
                }

                $lockedPurchase->update([
                    'receipt_status' => 'received',
                    'received_at' => now(),
                ]);

                return $lockedPurchase;
            }
        );

        $receivedPurchase
            ->load([
                'supplier',
                'items',
            ])
            ->loadCount('items');

        return new PurchaseResource(
            $receivedPurchase
        );
    }

    private function generatePurchaseNumber(): string
    {
        $prefix = 'PUR-'.now()->format('Ym').'-';

        $latestPurchase = Purchase::query()
            ->where(
                'purchase_no',
                'like',
                "{$prefix}%"
            )
            ->orderByDesc('purchase_no')
            ->lockForUpdate()
            ->first([
                'purchase_no',
            ]);

        $latestSequence = $latestPurchase
            ? (int) Str::afterLast(
                $latestPurchase->purchase_no,
                '-'
            )
            : 0;

        $nextSequence = $latestSequence + 1;

        return $prefix.str_pad(
            (string) $nextSequence,
            4,
            '0',
            STR_PAD_LEFT
        );
    }

    private function moneyToCents(
        string|int|float $amount
    ): int {
        return (int) round(
            ((float) $amount) * 100
        );
    }
}