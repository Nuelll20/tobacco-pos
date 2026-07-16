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

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    public function test_dashboard_summary_requires_authentication(): void
    {
        $response = $this->getJson(
            '/api/dashboard/summary'
        );

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_can_view_empty_dashboard_summary(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $response = $this->getJson(
            '/api/dashboard/summary'
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.period.key',
                'today'
            )
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
                1,
                'data.daily_sales'
            )
            ->assertJsonCount(
                3,
                'data.payment_methods'
            )
            ->assertJsonCount(
                0,
                'data.recent_transactions'
            )
            ->assertJsonCount(
                0,
                'data.low_stock_products'
            );
    }

    public function test_dashboard_summary_calculates_today_data_correctly(): void
    {
        $now = CarbonImmutable::create(
            2026,
            7,
            16,
            12,
            0,
            0,
            config('app.timezone')
        );

        CarbonImmutable::setTestNow($now);

        Sanctum::actingAs(
            User::factory()->create()
        );

        $lowStockProduct = Product::factory()->create([
            'sku' => 'LOW-001',
            'name' => 'Low Stock Product',
            'selling_price' => 50000,
            'stock' => 2,
            'minimum_stock' => 5,
            'is_active' => true,
        ]);

        $healthyProduct = Product::factory()->create([
            'sku' => 'SAFE-001',
            'name' => 'Healthy Stock Product',
            'selling_price' => 20000,
            'stock' => 20,
            'minimum_stock' => 5,
            'is_active' => true,
        ]);

        Product::factory()->create([
            'sku' => 'INACTIVE-LOW',
            'name' => 'Inactive Low Stock Product',
            'stock' => 0,
            'minimum_stock' => 10,
            'is_active' => false,
        ]);

        $firstTransaction = $this->createTransaction(
            transactionNo: 'TRX-20260716-001',
            paymentMethod: 'cash',
            totalAmount: 100000,
            product: $lowStockProduct,
            quantity: 2,
            unitPrice: 50000,
            createdAt: $now->setTime(9, 0)
        );

        $secondTransaction = $this->createTransaction(
            transactionNo: 'TRX-20260716-002',
            paymentMethod: 'qris',
            totalAmount: 60000,
            product: $healthyProduct,
            quantity: 3,
            unitPrice: 20000,
            createdAt: $now->setTime(11, 0)
        );

        $this->createTransaction(
            transactionNo: 'TRX-20260715-001',
            paymentMethod: 'transfer',
            totalAmount: 40000,
            product: $healthyProduct,
            quantity: 2,
            unitPrice: 20000,
            createdAt: $now
                ->subDay()
                ->setTime(10, 0)
        );

        $response = $this->getJson(
            '/api/dashboard/summary'
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.period.key',
                'today'
            )
            ->assertJsonPath(
                'data.period.start_date',
                '2026-07-16'
            )
            ->assertJsonPath(
                'data.period.end_date',
                '2026-07-16'
            )
            ->assertJsonPath(
                'data.summary.total_sales',
                '160000.00'
            )
            ->assertJsonPath(
                'data.summary.transaction_count',
                2
            )
            ->assertJsonPath(
                'data.summary.products_sold',
                5
            )
            ->assertJsonPath(
                'data.summary.average_transaction',
                '80000.00'
            )
            ->assertJsonPath(
                'data.daily_sales.0.date',
                '2026-07-16'
            )
            ->assertJsonPath(
                'data.daily_sales.0.total_sales',
                '160000.00'
            )
            ->assertJsonPath(
                'data.daily_sales.0.transaction_count',
                2
            )
            ->assertJsonPath(
                'data.payment_methods.0.payment_method',
                'cash'
            )
            ->assertJsonPath(
                'data.payment_methods.0.transaction_count',
                1
            )
            ->assertJsonPath(
                'data.payment_methods.0.total_sales',
                '100000.00'
            )
            ->assertJsonPath(
                'data.payment_methods.1.payment_method',
                'qris'
            )
            ->assertJsonPath(
                'data.payment_methods.1.transaction_count',
                1
            )
            ->assertJsonPath(
                'data.payment_methods.1.total_sales',
                '60000.00'
            )
            ->assertJsonPath(
                'data.payment_methods.2.payment_method',
                'transfer'
            )
            ->assertJsonPath(
                'data.payment_methods.2.transaction_count',
                0
            )
            ->assertJsonPath(
                'data.payment_methods.2.total_sales',
                '0.00'
            )
            ->assertJsonCount(
                2,
                'data.recent_transactions'
            )
            ->assertJsonPath(
                'data.recent_transactions.0.id',
                $secondTransaction->id
            )
            ->assertJsonPath(
                'data.recent_transactions.1.id',
                $firstTransaction->id
            )
            ->assertJsonCount(
                1,
                'data.low_stock_products'
            )
            ->assertJsonPath(
                'data.low_stock_products.0.id',
                $lowStockProduct->id
            )
            ->assertJsonPath(
                'data.low_stock_products.0.stock',
                2
            )
            ->assertJsonPath(
                'data.low_stock_products.0.minimum_stock',
                5
            )
            ->assertJsonPath(
                'data.low_stock_products.0.stock_shortage',
                3
            );
    }

    public function test_dashboard_summary_supports_period_filters(): void
    {
        $now = CarbonImmutable::create(
            2026,
            7,
            16,
            12,
            0,
            0,
            config('app.timezone')
        );

        CarbonImmutable::setTestNow($now);

        Sanctum::actingAs(
            User::factory()->create()
        );

        $product = Product::factory()->create([
            'sku' => 'PERIOD-001',
            'name' => 'Period Test Product',
            'selling_price' => 20000,
            'stock' => 100,
            'minimum_stock' => 5,
            'is_active' => true,
        ]);

        $this->createTransaction(
            transactionNo: 'TRX-PERIOD-TODAY',
            paymentMethod: 'cash',
            totalAmount: 100000,
            product: $product,
            quantity: 5,
            unitPrice: 20000,
            createdAt: $now->setTime(9, 0)
        );

        $this->createTransaction(
            transactionNo: 'TRX-PERIOD-6-DAYS',
            paymentMethod: 'qris',
            totalAmount: 60000,
            product: $product,
            quantity: 3,
            unitPrice: 20000,
            createdAt: $now
                ->subDays(6)
                ->setTime(10, 0)
        );

        $this->createTransaction(
            transactionNo: 'TRX-PERIOD-7-DAYS',
            paymentMethod: 'transfer',
            totalAmount: 40000,
            product: $product,
            quantity: 2,
            unitPrice: 20000,
            createdAt: $now
                ->subDays(7)
                ->setTime(11, 0)
        );

        $this->createTransaction(
            transactionNo: 'TRX-PERIOD-30-DAYS',
            paymentMethod: 'cash',
            totalAmount: 20000,
            product: $product,
            quantity: 1,
            unitPrice: 20000,
            createdAt: $now
                ->subDays(30)
                ->setTime(8, 0)
        );

        $sevenDaysResponse = $this->getJson(
            '/api/dashboard/summary?period=7_days'
        );

        $sevenDaysResponse
            ->assertOk()
            ->assertJsonPath(
                'data.period.key',
                '7_days'
            )
            ->assertJsonPath(
                'data.period.start_date',
                '2026-07-10'
            )
            ->assertJsonPath(
                'data.period.end_date',
                '2026-07-16'
            )
            ->assertJsonPath(
                'data.summary.total_sales',
                '160000.00'
            )
            ->assertJsonPath(
                'data.summary.transaction_count',
                2
            )
            ->assertJsonPath(
                'data.summary.products_sold',
                8
            )
            ->assertJsonCount(
                7,
                'data.daily_sales'
            );

        $thirtyDaysResponse = $this->getJson(
            '/api/dashboard/summary?period=30_days'
        );

        $thirtyDaysResponse
            ->assertOk()
            ->assertJsonPath(
                'data.period.key',
                '30_days'
            )
            ->assertJsonPath(
                'data.period.start_date',
                '2026-06-17'
            )
            ->assertJsonPath(
                'data.period.end_date',
                '2026-07-16'
            )
            ->assertJsonPath(
                'data.summary.total_sales',
                '200000.00'
            )
            ->assertJsonPath(
                'data.summary.transaction_count',
                3
            )
            ->assertJsonCount(
                30,
                'data.daily_sales'
            );

        $customResponse = $this->getJson(
            '/api/dashboard/summary?'.
            'period=custom&'.
            'start_date=2026-07-09&'.
            'end_date=2026-07-10'
        );

        $customResponse
            ->assertOk()
            ->assertJsonPath(
                'data.period.key',
                'custom'
            )
            ->assertJsonPath(
                'data.period.start_date',
                '2026-07-09'
            )
            ->assertJsonPath(
                'data.period.end_date',
                '2026-07-10'
            )
            ->assertJsonPath(
                'data.summary.total_sales',
                '100000.00'
            )
            ->assertJsonPath(
                'data.summary.transaction_count',
                2
            )
            ->assertJsonPath(
                'data.summary.products_sold',
                5
            )
            ->assertJsonCount(
                2,
                'data.daily_sales'
            );
    }

    public function test_dashboard_summary_validates_period_and_custom_dates(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $this->getJson(
            '/api/dashboard/summary?period=invalid'
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'period',
            ]);

        $this->getJson(
            '/api/dashboard/summary?period=custom'
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'start_date',
                'end_date',
            ]);

        $this->getJson(
            '/api/dashboard/summary?'.
            'period=custom&'.
            'start_date=2026-07-16&'.
            'end_date=2026-07-15'
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'end_date',
            ]);
    }

    private function createTransaction(
        string $transactionNo,
        string $paymentMethod,
        int $totalAmount,
        Product $product,
        int $quantity,
        int $unitPrice,
        CarbonImmutable $createdAt
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

        $item = new TransactionItem([
            'product_id' => $product->id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'subtotal' => $quantity * $unitPrice,
        ]);

        $item->transaction()->associate($transaction);
        $item->created_at = $createdAt;
        $item->updated_at = $createdAt;
        $item->save();

        return $transaction;
    }
}
