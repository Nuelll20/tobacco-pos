<?php

namespace App\Http\Controllers;

use App\Http\Requests\DashboardSummaryRequest;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Carbon\CarbonImmutable;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function summary(
        DashboardSummaryRequest $request
    ): JsonResponse {
        $validated = $request->validated();

        $period = $validated['period'] ?? 'today';

        [$startDate, $endDate] = $this->resolvePeriod(
            $period,
            $validated
        );

        $transactions = Transaction::query()
            ->whereBetween('created_at', [
                $startDate,
                $endDate,
            ]);

        $transactionCount = (clone $transactions)->count();

        $totalSales = (float) (clone $transactions)
            ->sum('total_amount');

        $productsSold = (int) TransactionItem::query()
            ->whereHas('transaction', function ($query) use (
                $startDate,
                $endDate
            ) {
                $query->whereBetween('created_at', [
                    $startDate,
                    $endDate,
                ]);
            })
            ->sum('quantity');

        $averageTransaction = $transactionCount > 0
            ? $totalSales / $transactionCount
            : 0;

        $paymentRows = (clone $transactions)
            ->selectRaw(
                'payment_method, COUNT(*) as transaction_count, SUM(total_amount) as total_sales'
            )
            ->groupBy('payment_method')
            ->get()
            ->keyBy('payment_method');

        $paymentMethods = collect([
            'cash',
            'qris',
            'transfer',
        ])->map(function (string $method) use ($paymentRows) {
            $row = $paymentRows->get($method);

            return [
                'payment_method' => $method,
                'transaction_count' => (int) (
                    $row?->transaction_count ?? 0
                ),
                'total_sales' => number_format(
                    (float) ($row?->total_sales ?? 0),
                    2,
                    '.',
                    ''
                ),
            ];
        })->values();

        $recentTransactions = Transaction::query()
            ->whereBetween('created_at', [
                $startDate,
                $endDate,
            ])
            ->withSum('items as products_sold', 'quantity')
            ->latest()
            ->limit(5)
            ->get()
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
                    'products_sold' => (int) (
                        $transaction->products_sold ?? 0
                    ),
                    'created_at' => $transaction->created_at?->toISOString(),
                ];
            })
            ->values();

        $lowStockProducts = Product::query()
            ->where('is_active', true)
            ->whereColumn('stock', '<=', 'minimum_stock')
            ->orderBy('stock')
            ->orderBy('name')
            ->limit(5)
            ->get([
                'id',
                'sku',
                'name',
                'stock',
                'minimum_stock',
            ])
            ->map(function (Product $product) {
                return [
                    'id' => $product->id,
                    'sku' => $product->sku,
                    'name' => $product->name,
                    'stock' => $product->stock,
                    'minimum_stock' => $product->minimum_stock,
                    'stock_shortage' => max(
                        $product->minimum_stock -
                            $product->stock,
                        0
                    ),
                ];
            })
            ->values();

        $dailyTransactionRows = Transaction::query()
            ->whereBetween('created_at', [
                $startDate,
                $endDate,
            ])
            ->orderBy('created_at')
            ->get([
                'total_amount',
                'created_at',
            ])
            ->groupBy(function (Transaction $transaction) {
                return $transaction->created_at
                    ?->toDateString();
            });

        $dailySales = collect(
            CarbonPeriod::create(
                $startDate->startOfDay(),
                $endDate->startOfDay()
            )
        )->map(function ($date) use ($dailyTransactionRows) {
            $dateKey = $date->toDateString();
            $rows = $dailyTransactionRows->get(
                $dateKey,
                collect()
            );

            return [
                'date' => $dateKey,
                'total_sales' => number_format(
                    (float) $rows->sum('total_amount'),
                    2,
                    '.',
                    ''
                ),
                'transaction_count' => $rows->count(),
            ];
        })->values();

        return response()->json([
            'data' => [
                'period' => [
                    'key' => $period,
                    'start_date' => $startDate->toDateString(),
                    'end_date' => $endDate->toDateString(),
                ],
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
                'daily_sales' => $dailySales,
                'payment_methods' => $paymentMethods,
                'recent_transactions' => $recentTransactions,
                'low_stock_products' => $lowStockProducts,
            ],
        ]);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array{CarbonImmutable, CarbonImmutable}
     */
    private function resolvePeriod(
        string $period,
        array $validated
    ): array {
        $now = CarbonImmutable::now(
            config('app.timezone')
        );

        return match ($period) {
            '7_days' => [
                $now->subDays(6)->startOfDay(),
                $now->endOfDay(),
            ],
            '30_days' => [
                $now->subDays(29)->startOfDay(),
                $now->endOfDay(),
            ],
            'custom' => [
                CarbonImmutable::parse(
                    $validated['start_date'],
                    config('app.timezone')
                )->startOfDay(),
                CarbonImmutable::parse(
                    $validated['end_date'],
                    config('app.timezone')
                )->endOfDay(),
            ],
            default => [
                $now->startOfDay(),
                $now->endOfDay(),
            ],
        };
    }
}
