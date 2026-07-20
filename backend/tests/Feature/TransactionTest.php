<?php

namespace Tests\Feature;

use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_cash_transaction_with_multiple_items(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $firstProduct = Product::factory()->create([
            'sku' => 'TEST-001',
            'name' => 'Test Product One',
            'selling_price' => 37726,
            'stock' => 10,
            'is_active' => true,
        ]);

        $secondProduct = Product::factory()->create([
            'sku' => 'TEST-002',
            'name' => 'Test Product Two',
            'selling_price' => 49827,
            'stock' => 5,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/transactions', [
            'payment_method' => 'cash',
            'paid_amount' => 130000,
            'note' => 'Feature test transaction',
            'items' => [
                [
                    'product_id' => $firstProduct->id,
                    'quantity' => 2,
                ],
                [
                    'product_id' => $secondProduct->id,
                    'quantity' => 1,
                ],
            ],
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.total_amount', '125279.00')
            ->assertJsonPath('data.payment_method', 'cash')
            ->assertJsonPath('data.paid_amount', '130000.00')
            ->assertJsonPath('data.change_amount', '4721.00')
            ->assertJsonCount(2, 'data.items');

        $transactionNo = $response->json('data.transaction_no');

        $this->assertNotEmpty($transactionNo);

        $transaction = Transaction::query()
            ->where('transaction_no', $transactionNo)
            ->firstOrFail();

        $this->assertSame('125279.00', $transaction->total_amount);
        $this->assertSame('130000.00', $transaction->paid_amount);
        $this->assertSame('4721.00', $transaction->change_amount);

        $this->assertDatabaseCount('transactions', 1);
        $this->assertDatabaseCount('transaction_items', 2);
        $this->assertDatabaseCount('inventory_movements', 2);

        $this->assertDatabaseHas('transaction_items', [
            'transaction_id' => $transaction->id,
            'product_id' => $firstProduct->id,
            'product_name' => 'Test Product One',
            'product_sku' => 'TEST-001',
            'quantity' => 2,
        ]);

        $this->assertDatabaseHas('transaction_items', [
            'transaction_id' => $transaction->id,
            'product_id' => $secondProduct->id,
            'product_name' => 'Test Product Two',
            'product_sku' => 'TEST-002',
            'quantity' => 1,
        ]);

        $this->assertDatabaseHas('inventory_movements', [
            'product_id' => $firstProduct->id,
            'type' => 'stock_out',
            'quantity' => 2,
            'stock_before' => 10,
            'stock_after' => 8,
            'reference_no' => $transactionNo,
        ]);

        $this->assertDatabaseHas('inventory_movements', [
            'product_id' => $secondProduct->id,
            'type' => 'stock_out',
            'quantity' => 1,
            'stock_before' => 5,
            'stock_after' => 4,
            'reference_no' => $transactionNo,
        ]);

        $this->assertSame(8, $firstProduct->fresh()->stock);
        $this->assertSame(4, $secondProduct->fresh()->stock);

        $this->assertSame(2, TransactionItem::query()->count());
        $this->assertSame(2, InventoryMovement::query()->count());
    }

    public function test_transaction_stores_cost_and_profit_snapshot(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $product = Product::factory()->create([
            'sku' => 'TEST-PROFIT-SNAPSHOT',
            'name' => 'Profit Snapshot Product',
            'purchase_price' => 18000,
            'selling_price' => 25000,
            'stock' => 10,
            'is_active' => true,
        ]);

        $createResponse = $this->postJson(
            '/api/transactions',
            [
                'payment_method' => 'cash',
                'paid_amount' => 50000,
                'note' => 'Profit snapshot test',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => 2,
                    ],
                ],
            ]
        );

        $createResponse
            ->assertCreated()
            ->assertJsonPath(
                'data.total_amount',
                '50000.00'
            )
            ->assertJsonPath(
                'data.items.0.unit_cost',
                '18000.00'
            )
            ->assertJsonPath(
                'data.items.0.cost_subtotal',
                '36000.00'
            )
            ->assertJsonPath(
                'data.items.0.gross_profit',
                '14000.00'
            );

        $transactionId = $createResponse->json(
            'data.id'
        );

        $this->assertDatabaseHas(
            'transaction_items',
            [
                'transaction_id' => $transactionId,
                'product_id' => $product->id,
                'quantity' => 2,
                'unit_price' => 25000,
                'subtotal' => 50000,
                'unit_cost' => 18000,
                'cost_subtotal' => 36000,
                'gross_profit' => 14000,
            ]
        );

        $product->update([
            'purchase_price' => 30000,
        ]);

        $detailResponse = $this->getJson(
            "/api/transactions/{$transactionId}"
        );

        $detailResponse
            ->assertOk()
            ->assertJsonPath(
                'data.items.0.unit_cost',
                '18000.00'
            )
            ->assertJsonPath(
                'data.items.0.cost_subtotal',
                '36000.00'
            )
            ->assertJsonPath(
                'data.items.0.gross_profit',
                '14000.00'
            );

        $this->assertSame(
            '30000.00',
            $product->fresh()->purchase_price
        );

        $this->assertDatabaseHas(
            'transaction_items',
            [
                'transaction_id' => $transactionId,
                'unit_cost' => 18000,
                'cost_subtotal' => 36000,
                'gross_profit' => 14000,
            ]
        );
    }
    public function test_transaction_fails_when_stock_is_not_enough_and_rolls_back_everything(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $product = Product::factory()->create([
            'sku' => 'TEST-STOCK',
            'name' => 'Limited Stock Product',
            'selling_price' => 25000,
            'stock' => 2,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/transactions', [
            'payment_method' => 'cash',
            'paid_amount' => 100000,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 3,
                ],
            ],
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'items.0.quantity',
            ]);

        $this->assertSame(
            'Stock is not enough for Limited Stock Product. Available stock: 2.',
            $response->json('errors')['items.0.quantity'][0]
        );

        $this->assertSame(2, $product->fresh()->stock);

        $this->assertDatabaseCount('transactions', 0);
        $this->assertDatabaseCount('transaction_items', 0);
        $this->assertDatabaseCount('inventory_movements', 0);
    }

    public function test_cash_transaction_fails_when_paid_amount_is_less_than_total(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $product = Product::factory()->create([
            'sku' => 'TEST-UNDERPAID',
            'name' => 'Underpaid Test Product',
            'selling_price' => 37726,
            'stock' => 5,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/transactions', [
            'payment_method' => 'cash',
            'paid_amount' => 30000,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                ],
            ],
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'paid_amount',
            ]);

        $this->assertSame(
            'Paid amount is less than the transaction total.',
            $response->json('errors')['paid_amount'][0]
        );

        $this->assertSame(5, $product->fresh()->stock);

        $this->assertDatabaseCount('transactions', 0);
        $this->assertDatabaseCount('transaction_items', 0);
        $this->assertDatabaseCount('inventory_movements', 0);
    }

    public function test_qris_transaction_fails_when_paid_amount_does_not_equal_total(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $product = Product::factory()->create([
            'sku' => 'TEST-QRIS-MISMATCH',
            'name' => 'QRIS Mismatch Product',
            'selling_price' => 37726,
            'stock' => 5,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/transactions', [
            'payment_method' => 'qris',
            'paid_amount' => 40000,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                ],
            ],
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'paid_amount',
            ]);

        $this->assertSame(
            'Paid amount must equal the transaction total for QRIS and transfer payments.',
            $response->json('errors')['paid_amount'][0]
        );

        $this->assertSame(5, $product->fresh()->stock);

        $this->assertDatabaseCount('transactions', 0);
        $this->assertDatabaseCount('transaction_items', 0);
        $this->assertDatabaseCount('inventory_movements', 0);
    }

    public function test_authenticated_user_can_create_valid_qris_transaction(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $product = Product::factory()->create([
            'sku' => 'TEST-QRIS-VALID',
            'name' => 'Valid QRIS Product',
            'selling_price' => 17443,
            'stock' => 14,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/transactions', [
            'payment_method' => 'qris',
            'paid_amount' => 17443,
            'note' => 'Valid QRIS feature test',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                ],
            ],
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.total_amount', '17443.00')
            ->assertJsonPath('data.payment_method', 'qris')
            ->assertJsonPath('data.paid_amount', '17443.00')
            ->assertJsonPath('data.change_amount', '0.00')
            ->assertJsonCount(1, 'data.items');

        $transactionNo = $response->json('data.transaction_no');

        $this->assertNotEmpty($transactionNo);
        $this->assertSame(13, $product->fresh()->stock);

        $this->assertDatabaseHas('transactions', [
            'transaction_no' => $transactionNo,
            'payment_method' => 'qris',
            'total_amount' => 17443,
            'paid_amount' => 17443,
            'change_amount' => 0,
        ]);

        $this->assertDatabaseHas('transaction_items', [
            'product_id' => $product->id,
            'product_name' => 'Valid QRIS Product',
            'product_sku' => 'TEST-QRIS-VALID',
            'quantity' => 1,
            'unit_price' => 17443,
            'subtotal' => 17443,
        ]);

        $this->assertDatabaseHas('inventory_movements', [
            'product_id' => $product->id,
            'type' => 'stock_out',
            'quantity' => 1,
            'stock_before' => 14,
            'stock_after' => 13,
            'reference_no' => $transactionNo,
        ]);

        $this->assertDatabaseCount('transactions', 1);
        $this->assertDatabaseCount('transaction_items', 1);
        $this->assertDatabaseCount('inventory_movements', 1);
    }

    public function test_transaction_rejects_duplicate_products(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $product = Product::factory()->create([
            'sku' => 'TEST-DUPLICATE',
            'name' => 'Duplicate Product',
            'selling_price' => 25000,
            'stock' => 10,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/transactions', [
            'payment_method' => 'cash',
            'paid_amount' => 100000,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                ],
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                ],
            ],
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'items.0.product_id',
                'items.1.product_id',
            ]);

        $this->assertSame(10, $product->fresh()->stock);

        $this->assertDatabaseCount('transactions', 0);
        $this->assertDatabaseCount('transaction_items', 0);
        $this->assertDatabaseCount('inventory_movements', 0);
    }

    public function test_transaction_rejects_inactive_product(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $product = Product::factory()->create([
            'sku' => 'TEST-INACTIVE',
            'name' => 'Inactive Product',
            'selling_price' => 25000,
            'stock' => 10,
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/transactions', [
            'payment_method' => 'cash',
            'paid_amount' => 50000,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                ],
            ],
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'items.0.product_id',
            ]);

        $this->assertSame(
            'Inactive Product is inactive and cannot be sold.',
            $response->json('errors')['items.0.product_id'][0]
        );

        $this->assertSame(10, $product->fresh()->stock);

        $this->assertDatabaseCount('transactions', 0);
        $this->assertDatabaseCount('transaction_items', 0);
        $this->assertDatabaseCount('inventory_movements', 0);
    }
}
