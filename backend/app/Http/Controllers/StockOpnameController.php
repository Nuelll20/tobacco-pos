<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStockOpnameRequest;
use App\Http\Requests\UpdateStockOpnameRequest;
use App\Http\Resources\StockOpnameResource;
use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\StockOpname;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class StockOpnameController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'nullable',
                Rule::in([
                    'draft',
                    'finalized',
                    'cancelled',
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
        $status = $validated['status'] ?? null;
        $dateFrom = $validated['date_from'] ?? null;
        $dateTo = $validated['date_to'] ?? null;
        $perPage = $validated['per_page'] ?? 10;

        $stockOpnames = StockOpname::query()
            ->withCount('items')
            ->when(
                $status,
                fn ($query, $status) => $query
                    ->where('status', $status)
            )
            ->when(
                $dateFrom,
                fn ($query, $dateFrom) => $query
                    ->whereDate(
                        'counted_at',
                        '>=',
                        $dateFrom
                    )
            )
            ->when(
                $dateTo,
                fn ($query, $dateTo) => $query
                    ->whereDate(
                        'counted_at',
                        '<=',
                        $dateTo
                    )
            )
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where(
                            'opname_no',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'note',
                            'like',
                            "%{$search}%"
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
            ->orderByDesc('counted_at')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return StockOpnameResource::collection(
            $stockOpnames
        );
    }

    public function store(
        StoreStockOpnameRequest $request
    ) {
        $data = $request->validated();

        $stockOpname = DB::transaction(
            function () use ($data) {
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

                $stockOpname = StockOpname::create([
                    'opname_no' =>
                        $this->generateStockOpnameNumber(),
                    'status' => 'draft',
                    'counted_at' =>
                        $data['counted_at'],
                    'note' =>
                        $data['note'] ?? null,
                    'finalized_at' => null,
                ]);

                foreach (
                    $requestedItems as $requestedItem
                ) {
                    $product = $products->get(
                        $requestedItem['product_id']
                    );

                    $systemStock =
                        (int) $product->stock;

                    $countedStock =
                        (int) $requestedItem[
                            'counted_stock'
                        ];

                    $stockOpname->items()->create([
                        'product_id' =>
                            $product->id,
                        'product_name' =>
                            $product->name,
                        'product_sku' =>
                            $product->sku,
                        'system_stock' =>
                            $systemStock,
                        'counted_stock' =>
                            $countedStock,
                        'difference' =>
                            $countedStock
                            - $systemStock,
                        'note' =>
                            $requestedItem['note']
                            ?? null,
                    ]);
                }

                return $stockOpname;
            }
        );

        $stockOpname
            ->load('items')
            ->loadCount('items');

        return (
            new StockOpnameResource(
                $stockOpname
            )
        )
            ->response()
            ->setStatusCode(
                Response::HTTP_CREATED
            );
    }

    public function update(
        UpdateStockOpnameRequest $request,
        StockOpname $stockOpname
    ) {
        $data = $request->validated();

        $updatedStockOpname = DB::transaction(
            function () use ($data, $stockOpname) {
                $lockedStockOpname = StockOpname::query()
                    ->lockForUpdate()
                    ->findOrFail($stockOpname->id);

                if ($lockedStockOpname->status !== 'draft') {
                    throw ValidationException::withMessages([
                        'status' => [
                            'Only draft stock opname can be edited.',
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

                $lockedStockOpname->update([
                    'counted_at' => $data['counted_at'],
                    'note' => $data['note'] ?? null,
                ]);

                $lockedStockOpname
                    ->items()
                    ->delete();

                foreach (
                    $requestedItems as $requestedItem
                ) {
                    $product = $products->get(
                        $requestedItem['product_id']
                    );

                    $systemStock =
                        (int) $product->stock;

                    $countedStock =
                        (int) $requestedItem[
                            'counted_stock'
                        ];

                    $lockedStockOpname
                        ->items()
                        ->create([
                            'product_id' =>
                                $product->id,
                            'product_name' =>
                                $product->name,
                            'product_sku' =>
                                $product->sku,
                            'system_stock' =>
                                $systemStock,
                            'counted_stock' =>
                                $countedStock,
                            'difference' =>
                                $countedStock
                                - $systemStock,
                            'note' =>
                                $requestedItem['note']
                                ?? null,
                        ]);
                }

                return $lockedStockOpname;
            }
        );

        $updatedStockOpname
            ->load('items')
            ->loadCount('items');

        return new StockOpnameResource(
            $updatedStockOpname
        );
    }

    public function finalize(StockOpname $stockOpname)
    {
        $finalizedStockOpname = DB::transaction(
            function () use ($stockOpname) {
                $lockedStockOpname = StockOpname::query()
                    ->with('items')
                    ->lockForUpdate()
                    ->findOrFail($stockOpname->id);

                if ($lockedStockOpname->status === 'finalized') {
                    return $lockedStockOpname;
                }

                if ($lockedStockOpname->status === 'cancelled') {
                    throw ValidationException::withMessages([
                        'status' => [
                            'Cancelled stock opname cannot be finalized.',
                        ],
                    ]);
                }

                if ($lockedStockOpname->items->isEmpty()) {
                    throw ValidationException::withMessages([
                        'items' => [
                            'Stock opname does not contain any items.',
                        ],
                    ]);
                }

                if (
                    $lockedStockOpname->items->contains(
                        fn ($item) => $item->product_id === null
                    )
                ) {
                    throw ValidationException::withMessages([
                        'items' => [
                            'One or more stock opname products no longer exist.',
                        ],
                    ]);
                }

                $productIds = $lockedStockOpname->items
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
                            'One or more stock opname products no longer exist.',
                        ],
                    ]);
                }

                foreach ($lockedStockOpname->items as $item) {
                    $product = $products->get(
                        $item->product_id
                    );

                    $currentStock = (int) $product->stock;
                    $systemStock = (int) $item->system_stock;

                    if ($currentStock !== $systemStock) {
                        throw ValidationException::withMessages([
                            'items' => [
                                'Stock for one or more products has changed since this stock opname was saved. Update the draft before finalizing.',
                            ],
                        ]);
                    }
                }

                foreach ($lockedStockOpname->items as $item) {
                    $product = $products->get(
                        $item->product_id
                    );

                    $stockBefore = (int) $product->stock;
                    $stockAfter = (int) $item->counted_stock;
                    $difference = $stockAfter - $stockBefore;

                    if ($difference === 0) {
                        continue;
                    }

                    $product->update([
                        'stock' => $stockAfter,
                    ]);

                    InventoryMovement::create([
                        'product_id' => $product->id,
                        'type' => 'adjustment',
                        'quantity' => $stockAfter,
                        'stock_before' => $stockBefore,
                        'stock_after' => $stockAfter,
                        'reference_no' =>
                            $lockedStockOpname->opname_no,
                        'note' =>
                            'Stock adjustment from stock opname.',
                    ]);
                }

                $lockedStockOpname->update([
                    'status' => 'finalized',
                    'finalized_at' => now(),
                ]);

                return $lockedStockOpname;
            }
        );

        $finalizedStockOpname
            ->load('items')
            ->loadCount('items');

        return new StockOpnameResource(
            $finalizedStockOpname
        );
    }

    public function cancel(StockOpname $stockOpname)
    {
        $cancelledStockOpname = DB::transaction(
            function () use ($stockOpname) {
                $lockedStockOpname = StockOpname::query()
                    ->with('items')
                    ->lockForUpdate()
                    ->findOrFail($stockOpname->id);

                if ($lockedStockOpname->status === 'finalized') {
                    throw ValidationException::withMessages([
                        'status' => [
                            'Finalized stock opname cannot be cancelled.',
                        ],
                    ]);
                }

                if ($lockedStockOpname->status !== 'cancelled') {
                    $lockedStockOpname->update([
                        'status' => 'cancelled',
                    ]);
                }

                return $lockedStockOpname;
            }
        );

        $cancelledStockOpname
            ->load('items')
            ->loadCount('items');

        return new StockOpnameResource(
            $cancelledStockOpname
        );
    }

    public function show(StockOpname $stockOpname)
    {
        $stockOpname
            ->load('items')
            ->loadCount('items');

        return new StockOpnameResource(
            $stockOpname
        );
    }

    private function generateStockOpnameNumber(): string
    {
        $prefix = 'OPN-'
            .now()->format('Ym')
            .'-';

        $latestStockOpname = StockOpname::query()
            ->where(
                'opname_no',
                'like',
                "{$prefix}%"
            )
            ->orderByDesc('opname_no')
            ->lockForUpdate()
            ->first([
                'opname_no',
            ]);

        $latestSequence = $latestStockOpname
            ? (int) Str::afterLast(
                $latestStockOpname->opname_no,
                '-'
            )
            : 0;

        return $prefix.str_pad(
            (string) ($latestSequence + 1),
            4,
            '0',
            STR_PAD_LEFT
        );
    }
}