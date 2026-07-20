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

        $transactionItemsQuery = TransactionItem::query()
            ->whereIn(
                'transaction_id',
                clone $transactionIds
            );

        $productsSold = (int) (
            clone $transactionItemsQuery
        )->sum('quantity');

        $totalItemCount = (int) (
            clone $transactionItemsQuery
        )->count();

        $missingCostItemsCount = (int) (
            clone $transactionItemsQuery
        )
            ->whereNull('cost_subtotal')
            ->count();

        $costedItemsCount =
            $totalItemCount -
            $missingCostItemsCount;

        $profitEligibleSales = (float) (
            clone $transactionItemsQuery
        )
            ->whereNotNull('cost_subtotal')
            ->sum('subtotal');

        $totalCost = (float) (
            clone $transactionItemsQuery
        )
            ->whereNotNull('cost_subtotal')
            ->sum('cost_subtotal');

        $grossProfit = (float) (
            clone $transactionItemsQuery
        )
            ->whereNotNull('gross_profit')
            ->sum('gross_profit');

        $grossMarginPercentage =
            $profitEligibleSales > 0
                ? (
                    $grossProfit /
                    $profitEligibleSales
                ) * 100
                : 0;

        $profitDataComplete =
            $missingCostItemsCount === 0;

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
            ->selectRaw(
                'SUM(
                    CASE
                        WHEN cost_subtotal IS NOT NULL
                        THEN subtotal
                        ELSE 0
                    END
                ) as profit_eligible_sales'
            )
            ->selectRaw(
                'SUM(
                    COALESCE(cost_subtotal, 0)
                ) as total_cost'
            )
            ->selectRaw(
                'SUM(
                    COALESCE(gross_profit, 0)
                ) as gross_profit'
            )
            ->selectRaw(
                'SUM(
                    CASE
                        WHEN cost_subtotal IS NULL
                        THEN 1
                        ELSE 0
                    END
                ) as missing_cost_items_count'
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
                $profitEligibleSales = (float) (
                    $item->profit_eligible_sales ?? 0
                );

                $grossProfit = (float) (
                    $item->gross_profit ?? 0
                );

                $grossMarginPercentage =
                    $profitEligibleSales > 0
                        ? (
                            $grossProfit /
                            $profitEligibleSales
                        ) * 100
                        : 0;

                $missingCostItemsCount = (int) (
                    $item->missing_cost_items_count ?? 0
                );

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
                    'profit_eligible_sales' => number_format(
                        $profitEligibleSales,
                        2,
                        '.',
                        ''
                    ),
                    'total_cost' => number_format(
                        (float) ($item->total_cost ?? 0),
                        2,
                        '.',
                        ''
                    ),
                    'gross_profit' => number_format(
                        $grossProfit,
                        2,
                        '.',
                        ''
                    ),
                    'gross_margin_percentage' => number_format(
                        $grossMarginPercentage,
                        2,
                        '.',
                        ''
                    ),
                    'missing_cost_items_count' =>
                        $missingCostItemsCount,
                    'profit_data_complete' =>
                        $missingCostItemsCount === 0,
                ];
            })
            ->values();

        $mostProfitableProducts = TransactionItem::query()
            ->whereIn(
                'transaction_id',
                clone $transactionIds
            )
            ->whereNotNull('cost_subtotal')
            ->whereNotNull('gross_profit')
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
            ->selectRaw(
                'SUM(cost_subtotal) as total_cost'
            )
            ->selectRaw(
                'SUM(gross_profit) as gross_profit'
            )
            ->selectRaw(
                'COUNT(*) as costed_items_count'
            )
            ->groupBy([
                'product_id',
                'product_name',
                'product_sku',
            ])
            ->orderByDesc('gross_profit')
            ->orderByDesc('total_sales')
            ->limit(5)
            ->get()
            ->map(function (TransactionItem $item) {
                $totalSales = (float) (
                    $item->total_sales ?? 0
                );

                $grossProfit = (float) (
                    $item->gross_profit ?? 0
                );

                $grossMarginPercentage =
                    $totalSales > 0
                        ? (
                            $grossProfit /
                            $totalSales
                        ) * 100
                        : 0;

                return [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'product_sku' => $item->product_sku,
                    'quantity_sold' => (int) (
                        $item->quantity_sold ?? 0
                    ),
                    'total_sales' => number_format(
                        $totalSales,
                        2,
                        '.',
                        ''
                    ),
                    'total_cost' => number_format(
                        (float) ($item->total_cost ?? 0),
                        2,
                        '.',
                        ''
                    ),
                    'gross_profit' => number_format(
                        $grossProfit,
                        2,
                        '.',
                        ''
                    ),
                    'gross_margin_percentage' => number_format(
                        $grossMarginPercentage,
                        2,
                        '.',
                        ''
                    ),
                    'costed_items_count' => (int) (
                        $item->costed_items_count ?? 0
                    ),
                    'profit_data_complete' => true,
                ];
            })
            ->values();
        $transactions = (clone $transactionsQuery)
            ->with([
                'items:id,transaction_id,product_name,product_sku,quantity,unit_price,subtotal,unit_cost,cost_subtotal,gross_profit',
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
                    $items = $transaction->items;

                    $costedItems = $items->filter(
                        fn (TransactionItem $item) =>
                            $item->cost_subtotal !== null
                    );

                    $missingCostItemsCount =
                        $items->count() -
                        $costedItems->count();

                    $profitEligibleSales = (float) $costedItems
                        ->sum('subtotal');

                    $totalCost = (float) $costedItems
                        ->sum('cost_subtotal');

                    $grossProfit = (float) $costedItems
                        ->sum('gross_profit');

                    $grossMarginPercentage =
                        $profitEligibleSales > 0
                            ? (
                                $grossProfit /
                                $profitEligibleSales
                            ) * 100
                            : 0;

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
                        'profit_eligible_sales' => number_format(
                            $profitEligibleSales,
                            2,
                            '.',
                            ''
                        ),
                        'total_cost' => number_format(
                            $totalCost,
                            2,
                            '.',
                            ''
                        ),
                        'gross_profit' => number_format(
                            $grossProfit,
                            2,
                            '.',
                            ''
                        ),
                        'gross_margin_percentage' => number_format(
                            $grossMarginPercentage,
                            2,
                            '.',
                            ''
                        ),
                        'missing_cost_items_count' =>
                            $missingCostItemsCount,
                        'profit_data_complete' =>
                            $missingCostItemsCount === 0,
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
                        'items' => $items
                            ->map(function (TransactionItem $item) {
                                $itemSubtotal = (float) $item->subtotal;

                                $itemGrossProfit =
                                    $item->gross_profit !== null
                                        ? (float) $item->gross_profit
                                        : null;

                                $itemMarginPercentage =
                                    $itemGrossProfit !== null
                                    && $itemSubtotal > 0
                                        ? (
                                            $itemGrossProfit /
                                            $itemSubtotal
                                        ) * 100
                                        : null;

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
                                        $itemSubtotal,
                                        2,
                                        '.',
                                        ''
                                    ),
                                    'unit_cost' =>
                                        $item->unit_cost !== null
                                            ? number_format(
                                                (float) $item->unit_cost,
                                                2,
                                                '.',
                                                ''
                                            )
                                            : null,
                                    'cost_subtotal' =>
                                        $item->cost_subtotal !== null
                                            ? number_format(
                                                (float) $item->cost_subtotal,
                                                2,
                                                '.',
                                                ''
                                            )
                                            : null,
                                    'gross_profit' =>
                                        $itemGrossProfit !== null
                                            ? number_format(
                                                $itemGrossProfit,
                                                2,
                                                '.',
                                                ''
                                            )
                                            : null,
                                    'gross_margin_percentage' =>
                                        $itemMarginPercentage !== null
                                            ? number_format(
                                                $itemMarginPercentage,
                                                2,
                                                '.',
                                                ''
                                            )
                                            : null,
                                    'profit_data_complete' =>
                                        $item->cost_subtotal !== null,
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
                    'total_cost' => number_format(
                        $totalCost,
                        2,
                        '.',
                        ''
                    ),
                    'gross_profit' => number_format(
                        $grossProfit,
                        2,
                        '.',
                        ''
                    ),
                    'gross_margin_percentage' => number_format(
                        $grossMarginPercentage,
                        2,
                        '.',
                        ''
                    ),
                    'profit_eligible_sales' => number_format(
                        $profitEligibleSales,
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
                    'costed_items_count' => $costedItemsCount,
                    'missing_cost_items_count' =>
                        $missingCostItemsCount,
                    'profit_data_complete' =>
                        $profitDataComplete,
                ],
                'top_products' => $topProducts,
                'most_profitable_products' =>
                    $mostProfitableProducts,
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
