<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'payment_method' => [
                'nullable',
                'string',
                Rule::in(['cash', 'qris', 'transfer']),
            ],
            'per_page' => ['nullable', 'integer', 'min:5', 'max:50'],
        ]);

        $search = $validated['search'] ?? null;
        $paymentMethod = $validated['payment_method'] ?? null;
        $perPage = $validated['per_page'] ?? 10;

        $transactions = Transaction::query()
            ->when($paymentMethod, function ($query, $paymentMethod) {
                $query->where('payment_method', $paymentMethod);
            })
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('transaction_no', 'like', "%{$search}%")
                        ->orWhere('note', 'like', "%{$search}%")
                        ->orWhereHas('items', function ($itemQuery) use ($search) {
                            $itemQuery
                                ->where('product_name', 'like', "%{$search}%")
                                ->orWhere('product_sku', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return TransactionResource::collection($transactions);
    }

    public function store(StoreTransactionRequest $request)
    {
        $data = $request->validated();

        $transaction = DB::transaction(function () use ($data) {
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
                    'items' => ['One or more selected products no longer exist.'],
                ]);
            }

            $preparedItems = [];
            $totalAmount = 0;

            foreach ($requestedItems as $index => $requestedItem) {
                $product = $products->get($requestedItem['product_id']);
                $quantity = (int) $requestedItem['quantity'];
                $stockBefore = (int) $product->stock;

                if (! $product->is_active) {
                    throw ValidationException::withMessages([
                        "items.{$index}.product_id" => [
                            "{$product->name} is inactive and cannot be sold.",
                        ],
                    ]);
                }

                if ($quantity > $stockBefore) {
                    throw ValidationException::withMessages([
                        "items.{$index}.quantity" => [
                            "Stock is not enough for {$product->name}. Available stock: {$stockBefore}.",
                        ],
                    ]);
                }

                $unitPrice = round((float) $product->selling_price, 2);
                $subtotal = round($unitPrice * $quantity, 2);

                $preparedItems[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                    'stock_before' => $stockBefore,
                    'stock_after' => $stockBefore - $quantity,
                ];

                $totalAmount = round($totalAmount + $subtotal, 2);
            }

            $paidAmount = round((float) $data['paid_amount'], 2);
            $paymentMethod = $data['payment_method'];

            $totalAmountInCents = (int) round($totalAmount * 100);
            $paidAmountInCents = (int) round($paidAmount * 100);

            if (
                $paymentMethod === 'cash'
                && $paidAmountInCents < $totalAmountInCents
            ) {
                throw ValidationException::withMessages([
                    'paid_amount' => ['Paid amount is less than the transaction total.'],
                ]);
            }

            if (
                in_array($paymentMethod, ['qris', 'transfer'], true)
                && $paidAmountInCents !== $totalAmountInCents
            ) {
                throw ValidationException::withMessages([
                    'paid_amount' => [
                        'Paid amount must equal the transaction total for QRIS and transfer payments.',
                    ],
                ]);
            }

            $changeAmount = $paymentMethod === 'cash'
                ? ($paidAmountInCents - $totalAmountInCents) / 100
                : 0;

            $transaction = Transaction::create([
                'transaction_no' => $this->generateTransactionNumber(),
                'total_amount' => $totalAmount,
                'payment_method' => $paymentMethod,
                'paid_amount' => $paidAmount,
                'change_amount' => $changeAmount,
                'note' => $data['note'] ?? null,
            ]);

            foreach ($preparedItems as $preparedItem) {
                $product = $preparedItem['product'];

                $transaction->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $preparedItem['quantity'],
                    'unit_price' => $preparedItem['unit_price'],
                    'subtotal' => $preparedItem['subtotal'],
                ]);

                $product->update([
                    'stock' => $preparedItem['stock_after'],
                ]);

                InventoryMovement::create([
                    'product_id' => $product->id,
                    'type' => 'stock_out',
                    'quantity' => $preparedItem['quantity'],
                    'stock_before' => $preparedItem['stock_before'],
                    'stock_after' => $preparedItem['stock_after'],
                    'reference_no' => $transaction->transaction_no,
                    'note' => 'Stock out from sales transaction.',
                ]);
            }

            return $transaction;
        });

        return (new TransactionResource($transaction->load('items')))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Transaction $transaction)
    {
        return new TransactionResource(
            $transaction->load('items')
        );
    }

    private function generateTransactionNumber(): string
    {
        do {
            $transactionNo = 'TRX-'
                .now()->format('YmdHis')
                .'-'
                .Str::upper(Str::random(4));
        } while (
            Transaction::query()
                ->where('transaction_no', $transactionNo)
                ->exists()
        );

        return $transactionNo;
    }
}
