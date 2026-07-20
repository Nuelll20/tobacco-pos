<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SalesReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_sales_report_requires_authentication(): void
    {
        $response = $this->getJson(
            '/api/reports/sales'
        );

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_can_view_empty_sales_report(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $response = $this->getJson(
            '/api/reports/sales'
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.summary.total_sales',
                '0.00'
            )
            ->assertJsonPath(
                'data.summary.transaction_count',
                0
            )
            ->assertJsonPath(
                'data.summary.products_sold',
                0
            )
            ->assertJsonPath(
                'data.summary.average_transaction',
                '0.00'
            )
            ->assertJsonCount(
                0,
                'data.top_products'
            )
            ->assertJsonCount(
                0,
                'data.transactions.data'
            )
            ->assertJsonPath(
                'data.transactions.current_page',
                1
            )
            ->assertJsonPath(
                'data.transactions.last_page',
                1
            )
            ->assertJsonPath(
                'data.transactions.per_page',
                10
            )
            ->assertJsonPath(
                'data.transactions.total',
                0
            )
            ->assertJsonPath(
                'data.transactions.from',
                null
            )
            ->assertJsonPath(
                'data.transactions.to',
                null
            );
    }

    public function test_sales_report_calculates_data_correctly(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $firstProduct = Product::factory()->create([
            'sku' => 'REPORT-001',
            'name' => 'Report Product One',
            'selling_price' => 50000,
            'stock' => 100,
            'is_active' => true,
        ]);

        $secondProduct = Product::factory()->create([
            'sku' => 'REPORT-002',
            'name' => 'Report Product Two',
            'selling_price' => 20000,
            'stock' => 100,
            'is_active' => true,
        ]);

        $firstTransaction = $this->createTransaction(
            transactionNo: 'TRX-REPORT-001',
            paymentMethod: 'cash',
            totalAmount: 100000,
            createdAt: CarbonImmutable::parse(
                '2026-07-14 09:00:00',
                config('app.timezone')
            ),
            items: [
                [
                    'product' => $firstProduct,
                    'quantity' => 2,
                    'unit_price' => 50000,
                ],
            ]
        );

        $secondTransaction = $this->createTransaction(
            transactionNo: 'TRX-REPORT-002',
            paymentMethod: 'qris',
            totalAmount: 70000,
            createdAt: CarbonImmutable::parse(
                '2026-07-15 10:00:00',
                config('app.timezone')
            ),
            items: [
                [
                    'product' => $firstProduct,
                    'quantity' => 1,
                    'unit_price' => 50000,
                ],
                [
                    'product' => $secondProduct,
                    'quantity' => 1,
                    'unit_price' => 20000,
                ],
            ]
        );

        $thirdTransaction = $this->createTransaction(
            transactionNo: 'TRX-REPORT-003',
            paymentMethod: 'transfer',
            totalAmount: 60000,
            createdAt: CarbonImmutable::parse(
                '2026-07-16 11:00:00',
                config('app.timezone')
            ),
            items: [
                [
                    'product' => $secondProduct,
                    'quantity' => 3,
                    'unit_price' => 20000,
                ],
            ]
        );

        $response = $this->getJson(
            '/api/reports/sales'
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.summary.total_sales',
                '230000.00'
            )
            ->assertJsonPath(
                'data.summary.transaction_count',
                3
            )
            ->assertJsonPath(
                'data.summary.products_sold',
                7
            )
            ->assertJsonPath(
                'data.summary.average_transaction',
                '76666.67'
            )
            ->assertJsonCount(
                2,
                'data.top_products'
            )
            ->assertJsonPath(
                'data.top_products.0.product_id',
                $secondProduct->id
            )
            ->assertJsonPath(
                'data.top_products.0.quantity_sold',
                4
            )
            ->assertJsonPath(
                'data.top_products.0.total_sales',
                '80000.00'
            )
            ->assertJsonPath(
                'data.top_products.1.product_id',
                $firstProduct->id
            )
            ->assertJsonPath(
                'data.top_products.1.quantity_sold',
                3
            )
            ->assertJsonPath(
                'data.top_products.1.total_sales',
                '150000.00'
            )
            ->assertJsonCount(
                3,
                'data.transactions.data'
            )
            ->assertJsonPath(
                'data.transactions.data.0.id',
                $thirdTransaction->id
            )
            ->assertJsonPath(
                'data.transactions.data.0.products_sold',
                3
            )
            ->assertJsonPath(
                'data.transactions.data.1.id',
                $secondTransaction->id
            )
            ->assertJsonPath(
                'data.transactions.data.1.products_sold',
                2
            )
            ->assertJsonPath(
                'data.transactions.data.2.id',
                $firstTransaction->id
            )
            ->assertJsonPath(
                'data.transactions.data.2.products_sold',
                2
            )
            ->assertJsonPath(
                'data.transactions.current_page',
                1
            )
            ->assertJsonPath(
                'data.transactions.last_page',
                1
            )
            ->assertJsonPath(
                'data.transactions.per_page',
                10
            )
            ->assertJsonPath(
                'data.transactions.total',
                3
            )
            ->assertJsonPath(
                'data.transactions.from',
                1
            )
            ->assertJsonPath(
                'data.transactions.to',
                3
            );
    }

    public function test_sales_report_calculates_profit_and_margin_from_transaction_snapshots(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $firstProduct = Product::factory()->create([
            'sku' => 'PROFIT-001',
            'name' => 'High Profit Product',
            'purchase_price' => 20000,
            'selling_price' => 50000,
            'stock' => 20,
            'is_active' => true,
        ]);

        $secondProduct = Product::factory()->create([
            'sku' => 'PROFIT-002',
            'name' => 'Volume Profit Product',
            'purchase_price' => 10000,
            'selling_price' => 20000,
            'stock' => 20,
            'is_active' => true,
        ]);

        $transactionResponse = $this->postJson(
            '/api/transactions',
            [
                'payment_method' => 'cash',
                'paid_amount' => 160000,
                'note' => 'Profit report integration test',
                'items' => [
                    [
                        'product_id' => $firstProduct->id,
                        'quantity' => 2,
                    ],
                    [
                        'product_id' => $secondProduct->id,
                        'quantity' => 3,
                    ],
                ],
            ]
        );

        $transactionResponse
            ->assertCreated()
            ->assertJsonPath(
                'data.total_amount',
                '160000.00'
            )
            ->assertJsonPath(
                'data.items.0.unit_cost',
                '20000.00'
            )
            ->assertJsonPath(
                'data.items.0.cost_subtotal',
                '40000.00'
            )
            ->assertJsonPath(
                'data.items.0.gross_profit',
                '60000.00'
            )
            ->assertJsonPath(
                'data.items.1.unit_cost',
                '10000.00'
            )
            ->assertJsonPath(
                'data.items.1.cost_subtotal',
                '30000.00'
            )
            ->assertJsonPath(
                'data.items.1.gross_profit',
                '30000.00'
            );

        $transactionId = $transactionResponse->json(
            'data.id'
        );

        $reportResponse = $this->getJson(
            '/api/reports/sales'
        );

        $reportResponse
            ->assertOk()
            ->assertJsonPath(
                'data.summary.total_sales',
                '160000.00'
            )
            ->assertJsonPath(
                'data.summary.total_cost',
                '70000.00'
            )
            ->assertJsonPath(
                'data.summary.gross_profit',
                '90000.00'
            )
            ->assertJsonPath(
                'data.summary.gross_margin_percentage',
                '56.25'
            )
            ->assertJsonPath(
                'data.summary.profit_eligible_sales',
                '160000.00'
            )
            ->assertJsonPath(
                'data.summary.costed_items_count',
                2
            )
            ->assertJsonPath(
                'data.summary.missing_cost_items_count',
                0
            )
            ->assertJsonPath(
                'data.summary.profit_data_complete',
                true
            );

        $reportResponse
            ->assertJsonPath(
                'data.top_products.0.product_id',
                $secondProduct->id
            )
            ->assertJsonPath(
                'data.top_products.0.quantity_sold',
                3
            )
            ->assertJsonPath(
                'data.top_products.0.total_cost',
                '30000.00'
            )
            ->assertJsonPath(
                'data.top_products.0.gross_profit',
                '30000.00'
            )
            ->assertJsonPath(
                'data.top_products.0.gross_margin_percentage',
                '50.00'
            )
            ->assertJsonPath(
                'data.top_products.0.profit_data_complete',
                true
            );

        $reportResponse
            ->assertJsonPath(
                'data.most_profitable_products.0.product_id',
                $firstProduct->id
            )
            ->assertJsonPath(
                'data.most_profitable_products.0.quantity_sold',
                2
            )
            ->assertJsonPath(
                'data.most_profitable_products.0.total_sales',
                '100000.00'
            )
            ->assertJsonPath(
                'data.most_profitable_products.0.total_cost',
                '40000.00'
            )
            ->assertJsonPath(
                'data.most_profitable_products.0.gross_profit',
                '60000.00'
            )
            ->assertJsonPath(
                'data.most_profitable_products.0.gross_margin_percentage',
                '60.00'
            );

        $reportResponse
            ->assertJsonPath(
                'data.transactions.data.0.id',
                $transactionId
            )
            ->assertJsonPath(
                'data.transactions.data.0.profit_eligible_sales',
                '160000.00'
            )
            ->assertJsonPath(
                'data.transactions.data.0.total_cost',
                '70000.00'
            )
            ->assertJsonPath(
                'data.transactions.data.0.gross_profit',
                '90000.00'
            )
            ->assertJsonPath(
                'data.transactions.data.0.gross_margin_percentage',
                '56.25'
            )
            ->assertJsonPath(
                'data.transactions.data.0.missing_cost_items_count',
                0
            )
            ->assertJsonPath(
                'data.transactions.data.0.profit_data_complete',
                true
            )
            ->assertJsonPath(
                'data.transactions.data.0.items.0.unit_cost',
                '20000.00'
            )
            ->assertJsonPath(
                'data.transactions.data.0.items.0.cost_subtotal',
                '40000.00'
            )
            ->assertJsonPath(
                'data.transactions.data.0.items.0.gross_profit',
                '60000.00'
            )
            ->assertJsonPath(
                'data.transactions.data.0.items.0.gross_margin_percentage',
                '60.00'
            )
            ->assertJsonPath(
                'data.transactions.data.0.items.0.profit_data_complete',
                true
            );
    }
    public function test_sales_report_marks_legacy_items_without_cost_snapshot_as_incomplete(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $costedProduct = Product::factory()->create([
            'sku' => 'COSTED-001',
            'name' => 'Costed Product',
            'purchase_price' => 20000,
            'selling_price' => 50000,
            'stock' => 10,
            'is_active' => true,
        ]);

        $legacyProduct = Product::factory()->create([
            'sku' => 'LEGACY-001',
            'name' => 'Legacy Product',
            'purchase_price' => 15000,
            'selling_price' => 30000,
            'stock' => 10,
            'is_active' => true,
        ]);

        $costedResponse = $this->postJson(
            '/api/transactions',
            [
                'payment_method' => 'cash',
                'paid_amount' => 50000,
                'items' => [
                    [
                        'product_id' => $costedProduct->id,
                        'quantity' => 1,
                    ],
                ],
            ]
        );

        $costedResponse->assertCreated();

        $legacyTransaction = Transaction::create([
            'transaction_no' => 'TRX-LEGACY-001',
            'total_amount' => 60000,
            'payment_method' => 'cash',
            'paid_amount' => 60000,
            'change_amount' => 0,
            'note' => 'Legacy transaction without cost snapshot',
        ]);

        TransactionItem::create([
            'transaction_id' => $legacyTransaction->id,
            'product_id' => $legacyProduct->id,
            'product_name' => $legacyProduct->name,
            'product_sku' => $legacyProduct->sku,
            'quantity' => 2,
            'unit_price' => 30000,
            'subtotal' => 60000,
            'unit_cost' => null,
            'cost_subtotal' => null,
            'gross_profit' => null,
        ]);

        $response = $this->getJson(
            '/api/reports/sales'
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.summary.total_sales',
                '110000.00'
            )
            ->assertJsonPath(
                'data.summary.profit_eligible_sales',
                '50000.00'
            )
            ->assertJsonPath(
                'data.summary.total_cost',
                '20000.00'
            )
            ->assertJsonPath(
                'data.summary.gross_profit',
                '30000.00'
            )
            ->assertJsonPath(
                'data.summary.gross_margin_percentage',
                '60.00'
            )
            ->assertJsonPath(
                'data.summary.costed_items_count',
                1
            )
            ->assertJsonPath(
                'data.summary.missing_cost_items_count',
                1
            )
            ->assertJsonPath(
                'data.summary.profit_data_complete',
                false
            );

        $legacyRow = collect(
            $response->json(
                'data.transactions.data'
            )
        )->firstWhere(
            'id',
            $legacyTransaction->id
        );

        $this->assertNotNull(
            $legacyRow
        );

        $this->assertSame(
            '0.00',
            $legacyRow['profit_eligible_sales']
        );

        $this->assertSame(
            '0.00',
            $legacyRow['total_cost']
        );

        $this->assertSame(
            '0.00',
            $legacyRow['gross_profit']
        );

        $this->assertSame(
            1,
            $legacyRow['missing_cost_items_count']
        );

        $this->assertFalse(
            $legacyRow['profit_data_complete']
        );

        $this->assertNull(
            $legacyRow['items'][0]['unit_cost']
        );

        $this->assertNull(
            $legacyRow['items'][0]['cost_subtotal']
        );

        $this->assertNull(
            $legacyRow['items'][0]['gross_profit']
        );

        $this->assertNull(
            $legacyRow['items'][0]['gross_margin_percentage']
        );

        $this->assertFalse(
            $legacyRow['items'][0]['profit_data_complete']
        );

        $mostProfitableProductIds = collect(
            $response->json(
                'data.most_profitable_products'
            )
        )->pluck('product_id');

        $this->assertTrue(
            $mostProfitableProductIds->contains(
                $costedProduct->id
            )
        );

        $this->assertFalse(
            $mostProfitableProductIds->contains(
                $legacyProduct->id
            )
        );
    }
    public function test_sales_report_applies_search_payment_and_date_filters(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $firstProduct = Product::factory()->create([
            'sku' => 'FILTER-ALPHA',
            'name' => 'Alpha Filter Product',
            'selling_price' => 50000,
            'stock' => 100,
            'is_active' => true,
        ]);

        $secondProduct = Product::factory()->create([
            'sku' => 'FILTER-BETA',
            'name' => 'Beta Filter Product',
            'selling_price' => 20000,
            'stock' => 100,
            'is_active' => true,
        ]);

        $firstTransaction = $this->createTransaction(
            transactionNo: 'TRX-FILTER-001',
            paymentMethod: 'cash',
            totalAmount: 100000,
            createdAt: CarbonImmutable::parse(
                '2026-07-10 09:00:00',
                config('app.timezone')
            ),
            items: [
                [
                    'product' => $firstProduct,
                    'quantity' => 2,
                    'unit_price' => 50000,
                ],
            ]
        );

        $secondTransaction = $this->createTransaction(
            transactionNo: 'TRX-FILTER-002',
            paymentMethod: 'qris',
            totalAmount: 60000,
            createdAt: CarbonImmutable::parse(
                '2026-07-12 10:00:00',
                config('app.timezone')
            ),
            items: [
                [
                    'product' => $secondProduct,
                    'quantity' => 3,
                    'unit_price' => 20000,
                ],
            ]
        );

        $thirdTransaction = $this->createTransaction(
            transactionNo: 'TRX-FILTER-003',
            paymentMethod: 'transfer',
            totalAmount: 50000,
            createdAt: CarbonImmutable::parse(
                '2026-07-14 11:00:00',
                config('app.timezone')
            ),
            items: [
                [
                    'product' => $firstProduct,
                    'quantity' => 1,
                    'unit_price' => 50000,
                ],
            ]
        );

        $searchResponse = $this->getJson(
            '/api/reports/sales?search=FILTER-BETA'
        );

        $searchResponse
            ->assertOk()
            ->assertJsonPath(
                'data.summary.total_sales',
                '60000.00'
            )
            ->assertJsonPath(
                'data.summary.transaction_count',
                1
            )
            ->assertJsonPath(
                'data.summary.products_sold',
                3
            )
            ->assertJsonCount(
                1,
                'data.transactions.data'
            )
            ->assertJsonPath(
                'data.transactions.data.0.id',
                $secondTransaction->id
            )
            ->assertJsonPath(
                'data.top_products.0.product_id',
                $secondProduct->id
            );

        $paymentResponse = $this->getJson(
            '/api/reports/sales?payment_method=cash'
        );

        $paymentResponse
            ->assertOk()
            ->assertJsonPath(
                'data.summary.total_sales',
                '100000.00'
            )
            ->assertJsonPath(
                'data.summary.transaction_count',
                1
            )
            ->assertJsonPath(
                'data.transactions.data.0.id',
                $firstTransaction->id
            );

        $dateResponse = $this->getJson(
            '/api/reports/sales?'.
            'start_date=2026-07-12&'.
            'end_date=2026-07-14'
        );

        $dateResponse
            ->assertOk()
            ->assertJsonPath(
                'data.summary.total_sales',
                '110000.00'
            )
            ->assertJsonPath(
                'data.summary.transaction_count',
                2
            )
            ->assertJsonPath(
                'data.summary.products_sold',
                4
            )
            ->assertJsonCount(
                2,
                'data.transactions.data'
            )
            ->assertJsonPath(
                'data.transactions.data.0.id',
                $thirdTransaction->id
            )
            ->assertJsonPath(
                'data.transactions.data.1.id',
                $secondTransaction->id
            );

        $numberResponse = $this->getJson(
            '/api/reports/sales?search=TRX-FILTER-003'
        );

        $numberResponse
            ->assertOk()
            ->assertJsonPath(
                'data.summary.transaction_count',
                1
            )
            ->assertJsonPath(
                'data.transactions.data.0.id',
                $thirdTransaction->id
            );
    }

    public function test_sales_report_validates_filter_parameters(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $this->getJson(
            '/api/reports/sales?payment_method=card'
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'payment_method',
            ]);

        $this->getJson(
            '/api/reports/sales?start_date=16-07-2026'
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'start_date',
            ]);

        $this->getJson(
            '/api/reports/sales?'.
            'start_date=2026-07-16&'.
            'end_date=2026-07-15'
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'end_date',
            ]);

        $this->getJson(
            '/api/reports/sales?per_page=4'
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'per_page',
            ]);

        $this->getJson(
            '/api/reports/sales?per_page=51'
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'per_page',
            ]);
    }

    public function test_sales_report_paginates_transactions_without_limiting_summary(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $product = Product::factory()->create([
            'sku' => 'PAGE-001',
            'name' => 'Pagination Product',
            'selling_price' => 10000,
            'stock' => 100,
            'is_active' => true,
        ]);

        $transactions = [];

        for ($index = 1; $index <= 12; $index++) {
            $transactions[] = $this->createTransaction(
                transactionNo: sprintf(
                    'TRX-PAGE-%03d',
                    $index
                ),
                paymentMethod: 'cash',
                totalAmount: 10000,
                createdAt: CarbonImmutable::parse(
                    '2026-07-01 09:00:00',
                    config('app.timezone')
                )->addDays($index),
                items: [
                    [
                        'product' => $product,
                        'quantity' => 1,
                        'unit_price' => 10000,
                    ],
                ]
            );
        }

        $response = $this->getJson(
            '/api/reports/sales?'.
            'per_page=5&page=2'
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.summary.total_sales',
                '120000.00'
            )
            ->assertJsonPath(
                'data.summary.transaction_count',
                12
            )
            ->assertJsonPath(
                'data.summary.products_sold',
                12
            )
            ->assertJsonPath(
                'data.summary.average_transaction',
                '10000.00'
            )
            ->assertJsonPath(
                'data.top_products.0.product_id',
                $product->id
            )
            ->assertJsonPath(
                'data.top_products.0.quantity_sold',
                12
            )
            ->assertJsonPath(
                'data.top_products.0.total_sales',
                '120000.00'
            )
            ->assertJsonCount(
                5,
                'data.transactions.data'
            )
            ->assertJsonPath(
                'data.transactions.current_page',
                2
            )
            ->assertJsonPath(
                'data.transactions.last_page',
                3
            )
            ->assertJsonPath(
                'data.transactions.per_page',
                5
            )
            ->assertJsonPath(
                'data.transactions.total',
                12
            )
            ->assertJsonPath(
                'data.transactions.from',
                6
            )
            ->assertJsonPath(
                'data.transactions.to',
                10
            )
            ->assertJsonPath(
                'data.transactions.data.0.id',
                $transactions[6]->id
            )
            ->assertJsonPath(
                'data.transactions.data.4.id',
                $transactions[2]->id
            );
    }

    /**
     * @param array<int, array{
     *     product: Product,
     *     quantity: int,
     *     unit_price: int
     * }> $items
     */
    private function createTransaction(
        string $transactionNo,
        string $paymentMethod,
        int $totalAmount,
        CarbonImmutable $createdAt,
        array $items
    ): Transaction {
        $transaction = new Transaction([
            'transaction_no' => $transactionNo,
            'total_amount' => $totalAmount,
            'payment_method' => $paymentMethod,
            'paid_amount' => $totalAmount,
            'change_amount' => 0,
            'note' => null,
        ]);

        $transaction->created_at = $createdAt;
        $transaction->updated_at = $createdAt;
        $transaction->save();

        foreach ($items as $itemData) {
            $product = $itemData['product'];
            $quantity = $itemData['quantity'];
            $unitPrice = $itemData['unit_price'];

            $item = new TransactionItem([
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_sku' => $product->sku,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'subtotal' => $quantity * $unitPrice,
            ]);

            $item->transaction()->associate(
                $transaction
            );

            $item->created_at = $createdAt;
            $item->updated_at = $createdAt;
            $item->save();
        }

        return $transaction;
    }
}
