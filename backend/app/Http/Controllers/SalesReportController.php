<?php

namespace App\Http\Controllers;

use App\Http\Requests\SalesReportRequest;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

class SalesReportController extends Controller
{
    public function index(
        SalesReportRequest $request
    ): JsonResponse {
        $validated = $request->validated();

        $perPage = $validated['per_page'] ?? 10;

        $transactionsQuery = Transaction::query();

        $this->applyFilters(
            $transactionsQuery,
            $validated
        );

        $transactionIds = (clone $transactionsQuery)
            ->select('transactions.id');

        $transactionCount = (clone $transactionsQuery)
            ->count();

        $totalSales = (float) (clone $transactionsQuery)
            ->sum('total_amount');

        $productsSold = (int) TransactionItem::query()
            ->whereIn(
                'transaction_id',
                clone $transactionIds
            )
            ->sum('quantity');

        $averageTransaction = $transactionCount > 0
            ? $totalSales / $transactionCount
            : 0;

        $topProducts = TransactionItem::query()
            ->whereIn(
                'transaction_id',
                clone $transactionIds
            )
            ->select([
                'product_id',
                'product_name',
                'product_sku',
            ])
            ->selectRaw(
                'SUM(quantity) as quantity_sold'
            )
            ->selectRaw(
                'SUM(subtotal) as total_sales'
            )
            ->groupBy([
                'product_id',
                'product_name',
                'product_sku',
            ])
            ->orderByDesc('quantity_sold')
            ->orderByDesc('total_sales')
            ->limit(5)
            ->get()
            ->map(function (TransactionItem $item) {
                return [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'product_sku' => $item->product_sku,
                    'quantity_sold' => (int) $item->quantity_sold,
                    'total_sales' => number_format(
                        (float) $item->total_sales,
                        2,
                        '.',
                        ''
                    ),
                ];
            })
            ->values();

        $transactions = (clone $transactionsQuery)
            ->with([
                'items:id,transaction_id,product_name,product_sku,quantity,unit_price,subtotal',
            ])
            ->withSum(
                'items as products_sold',
                'quantity'
            )
            ->latest('created_at')
            ->paginate($perPage)
            ->withQueryString();

        $transactions->setCollection(
            $transactions
                ->getCollection()
                ->map(function (Transaction $transaction) {
                    return [
                        'id' => $transaction->id,
                        'transaction_no' => $transaction->transaction_no,
                        'payment_method' => $transaction->payment_method,
                        'total_amount' => number_format(
                            (float) $transaction->total_amount,
                            2,
                            '.',
                            ''
                        ),
                        'paid_amount' => number_format(
                            (float) $transaction->paid_amount,
                            2,
                            '.',
                            ''
                        ),
                        'change_amount' => number_format(
                            (float) $transaction->change_amount,
                            2,
                            '.',
                            ''
                        ),
                        'products_sold' => (int) (
                            $transaction->products_sold ?? 0
                        ),
                        'items' => $transaction->items
                            ->map(function (TransactionItem $item) {
                                return [
                                    'id' => $item->id,
                                    'product_name' => $item->product_name,
                                    'product_sku' => $item->product_sku,
                                    'quantity' => (int) $item->quantity,
                                    'unit_price' => number_format(
                                        (float) $item->unit_price,
                                        2,
                                        '.',
                                        ''
                                    ),
                                    'subtotal' => number_format(
                                        (float) $item->subtotal,
                                        2,
                                        '.',
                                        ''
                                    ),
                                ];
                            })
                            ->values(),
                        'note' => $transaction->note,
                        'created_at' => $transaction->created_at?->toISOString(),
                    ];
                })
        );

        return response()->json([
            'data' => [
                'summary' => [
                    'total_sales' => number_format(
                        $totalSales,
                        2,
                        '.',
                        ''
                    ),
                    'transaction_count' => $transactionCount,
                    'products_sold' => $productsSold,
                    'average_transaction' => number_format(
                        $averageTransaction,
                        2,
                        '.',
                        ''
                    ),
                ],
                'top_products' => $topProducts,
                'transactions' => [
                    'data' => $transactions->items(),
                    'current_page' => $transactions->currentPage(),
                    'last_page' => $transactions->lastPage(),
                    'per_page' => $transactions->perPage(),
                    'total' => $transactions->total(),
                    'from' => $transactions->firstItem(),
                    'to' => $transactions->lastItem(),
                ],
            ],
        ]);
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applyFilters(
        Builder $query,
        array $filters
    ): void {
        $query
            ->when(
                $filters['payment_method'] ?? null,
                function (
                    Builder $query,
                    string $paymentMethod
                ) {
                    $query->where(
                        'payment_method',
                        $paymentMethod
                    );
                }
            )
            ->when(
                $filters['search'] ?? null,
                function (
                    Builder $query,
                    string $search
                ) {
                    $query->where(
                        function (Builder $query) use (
                            $search
                        ) {
                            $query
                                ->where(
                                    'transaction_no',
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
                                    function (
                                        Builder $itemQuery
                                    ) use ($search) {
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
                        }
                    );
                }
            );

        if (! empty($filters['start_date'])) {
            $startDate = CarbonImmutable::parse(
                $filters['start_date'],
                config('app.timezone')
            )->startOfDay();

            $query->where(
                'created_at',
                '>=',
                $startDate
            );
        }

        if (! empty($filters['end_date'])) {
            $endDate = CarbonImmutable::parse(
                $filters['end_date'],
                config('app.timezone')
            )->endOfDay();

            $query->where(
                'created_at',
                '<=',
                $endDate
            );
        }
    }
}
