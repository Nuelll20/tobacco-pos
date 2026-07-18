<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PurchaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_purchase_endpoints_require_authentication(): void
    {
        $this->getJson('/api/purchases')
            ->assertUnauthorized();

        $this->postJson('/api/purchases', [])
            ->assertUnauthorized();
    }

    public function test_authenticated_user_can_create_ordered_purchase_without_changing_stock(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $supplier = Supplier::create([
            'name' => 'PT Distributor Utama',
            'phone' => '081234567890',
            'address' => 'Jakarta',
            'notes' => null,
            'is_active' => true,
        ]);

        $firstProduct = Product::factory()->create([
            'sku' => 'PURCHASE-001',
            'name' => 'Purchase Product One',
            'purchase_price' => 20000,
            'stock' => 10,
            'is_active' => true,
        ]);

        $secondProduct = Product::factory()->create([
            'sku' => 'PURCHASE-002',
            'name' => 'Purchase Product Two',
            'purchase_price' => 15000,
            'stock' => 5,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/purchases', [
            'purchase_date' => '2026-07-19',
            'supplier_id' => $supplier->id,
            'receipt_status' => 'ordered',
            'paid_amount' => 50000,
            'notes' => 'Pembelian stok mingguan',
            'items' => [
                [
                    'product_id' => $firstProduct->id,
                    'quantity' => 2,
                    'unit_cost' => 25000,
                ],
                [
                    'product_id' => $secondProduct->id,
                    'quantity' => 3,
                    'unit_cost' => 20000,
                ],
            ],
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath(
                'data.purchase_no',
                'PUR-202607-0001'
            )
            ->assertJsonPath(
                'data.purchase_date',
                '2026-07-19'
            )
            ->assertJsonPath(
                'data.supplier.id',
                $supplier->id
            )
            ->assertJsonPath(
                'data.receipt_status',
                'ordered'
            )
            ->assertJsonPath(
                'data.payment_status',
                'partial'
            )
            ->assertJsonPath(
                'data.paid_amount',
                '50000.00'
            )
            ->assertJsonPath(
                'data.total_amount',
                '110000.00'
            )
            ->assertJsonPath(
                'data.items_count',
                2
            )
            ->assertJsonCount(
                2,
                'data.items'
            );

        $purchaseId = $response->json('data.id');

        $this->assertDatabaseHas('purchases', [
            'id' => $purchaseId,
            'purchase_no' => 'PUR-202607-0001',
            'supplier_id' => $supplier->id,
            'receipt_status' => 'ordered',
            'payment_status' => 'partial',
            'paid_amount' => 50000,
            'total_amount' => 110000,
            'received_at' => null,
        ]);

        $this->assertDatabaseHas('purchase_items', [
            'purchase_id' => $purchaseId,
            'product_id' => $firstProduct->id,
            'product_name' => 'Purchase Product One',
            'product_sku' => 'PURCHASE-001',
            'quantity' => 2,
            'unit_cost' => 25000,
            'subtotal' => 50000,
        ]);

        $this->assertDatabaseHas('purchase_items', [
            'purchase_id' => $purchaseId,
            'product_id' => $secondProduct->id,
            'product_name' => 'Purchase Product Two',
            'product_sku' => 'PURCHASE-002',
            'quantity' => 3,
            'unit_cost' => 20000,
            'subtotal' => 60000,
        ]);

        $this->assertSame(
            10,
            $firstProduct->fresh()->stock
        );

        $this->assertSame(
            5,
            $secondProduct->fresh()->stock
        );

        $this->assertDatabaseCount(
            'inventory_movements',
            0
        );
    }

    public function test_purchase_payment_status_is_calculated_by_backend(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $supplier = Supplier::create([
            'name' => 'Status Supplier',
            'phone' => null,
            'address' => null,
            'notes' => null,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'sku' => 'PAYMENT-001',
            'name' => 'Payment Status Product',
            'stock' => 10,
            'is_active' => true,
        ]);

        $unpaidResponse = $this->postJson(
            '/api/purchases',
            $this->purchasePayload(
                $supplier->id,
                $product->id,
                0
            )
        );

        $unpaidResponse
            ->assertCreated()
            ->assertJsonPath(
                'data.payment_status',
                'unpaid'
            );

        $paidResponse = $this->postJson(
            '/api/purchases',
            $this->purchasePayload(
                $supplier->id,
                $product->id,
                50000
            )
        );

        $paidResponse
            ->assertCreated()
            ->assertJsonPath(
                'data.payment_status',
                'paid'
            )
            ->assertJsonPath(
                'data.purchase_no',
                'PUR-202607-0002'
            );
    }

    public function test_purchase_rejects_payment_above_total(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $supplier = Supplier::create([
            'name' => 'Validation Supplier',
            'phone' => null,
            'address' => null,
            'notes' => null,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'sku' => 'VALIDATION-001',
            'name' => 'Validation Product',
            'stock' => 10,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/purchases', [
            'purchase_date' => '2026-07-19',
            'supplier_id' => $supplier->id,
            'receipt_status' => 'draft',
            'paid_amount' => 60000,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                    'unit_cost' => 25000,
                ],
            ],
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'paid_amount',
            ]);

        $this->assertDatabaseCount('purchases', 0);
        $this->assertDatabaseCount('purchase_items', 0);
        $this->assertDatabaseCount('inventory_movements', 0);
        $this->assertSame(10, $product->fresh()->stock);
    }

    public function test_purchase_list_supports_search_and_filters(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $supplier = Supplier::create([
            'name' => 'Alpha Distributor',
            'phone' => null,
            'address' => null,
            'notes' => null,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'sku' => 'FILTER-PURCHASE',
            'name' => 'Filter Purchase Product',
            'stock' => 10,
            'is_active' => true,
        ]);

        $createResponse = $this->postJson(
            '/api/purchases',
            $this->purchasePayload(
                $supplier->id,
                $product->id,
                25000
            )
        );

        $createResponse->assertCreated();

        $purchaseId = $createResponse->json('data.id');

        $searchResponse = $this->getJson(
            '/api/purchases?search=FILTER-PURCHASE'
        );

        $searchResponse
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath(
                'data.0.id',
                $purchaseId
            );

        $supplierResponse = $this->getJson(
            "/api/purchases?supplier_id={$supplier->id}"
        );

        $supplierResponse
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $statusResponse = $this->getJson(
            '/api/purchases?'.
            'receipt_status=draft&'.
            'payment_status=partial'
        );

        $statusResponse
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath(
                'data.0.id',
                $purchaseId
            );
    }

    public function test_authenticated_user_can_view_purchase_detail(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $supplier = Supplier::create([
            'name' => 'Detail Supplier',
            'phone' => null,
            'address' => null,
            'notes' => null,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'sku' => 'DETAIL-001',
            'name' => 'Detail Product',
            'stock' => 10,
            'is_active' => true,
        ]);

        $createResponse = $this->postJson(
            '/api/purchases',
            $this->purchasePayload(
                $supplier->id,
                $product->id,
                50000
            )
        );

        $createResponse->assertCreated();

        $purchaseId = $createResponse->json('data.id');

        $response = $this->getJson(
            "/api/purchases/{$purchaseId}"
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.id',
                $purchaseId
            )
            ->assertJsonPath(
                'data.supplier.id',
                $supplier->id
            )
            ->assertJsonPath(
                'data.items.0.product_id',
                $product->id
            )
            ->assertJsonPath(
                'data.items.0.product_name',
                'Detail Product'
            );
    }


    public function test_purchase_can_be_received_once_and_updates_stock(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $supplier = Supplier::create([
            'name' => 'Receive Supplier',
            'phone' => null,
            'address' => null,
            'notes' => null,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'sku' => 'RECEIVE-001',
            'name' => 'Receive Product',
            'purchase_price' => 20000,
            'stock' => 10,
            'is_active' => true,
        ]);

        $createResponse = $this->postJson(
            '/api/purchases',
            [
                'purchase_date' => '2026-07-19',
                'supplier_id' => $supplier->id,
                'receipt_status' => 'ordered',
                'paid_amount' => 75000,
                'notes' => 'Receive feature test',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => 3,
                        'unit_cost' => 25000,
                    ],
                ],
            ]
        );

        $createResponse
            ->assertCreated()
            ->assertJsonPath(
                'data.receipt_status',
                'ordered'
            )
            ->assertJsonPath(
                'data.total_amount',
                '75000.00'
            );

        $purchaseId = $createResponse->json(
            'data.id'
        );

        $purchaseNo = $createResponse->json(
            'data.purchase_no'
        );

        $receiveResponse = $this->postJson(
            "/api/purchases/{$purchaseId}/receive"
        );

        $receiveResponse
            ->assertOk()
            ->assertJsonPath(
                'data.receipt_status',
                'received'
            );

        $this->assertNotNull(
            $receiveResponse->json(
                'data.received_at'
            )
        );

        $freshProduct = $product->fresh();

        $this->assertSame(
            13,
            $freshProduct->stock
        );

        $this->assertSame(
            '21153.85',
            $freshProduct->purchase_price
        );

        $this->assertDatabaseHas(
            'inventory_movements',
            [
                'product_id' => $product->id,
                'type' => 'stock_in',
                'quantity' => 3,
                'stock_before' => 10,
                'stock_after' => 13,
                'reference_no' => $purchaseNo,
                'note' =>
                    'Purchase from Receive Supplier.',
            ]
        );

        $this->assertDatabaseHas(
            'purchases',
            [
                'id' => $purchaseId,
                'receipt_status' => 'received',
            ]
        );

        $this->assertDatabaseCount(
            'inventory_movements',
            1
        );

        $secondReceiveResponse = $this->postJson(
            "/api/purchases/{$purchaseId}/receive"
        );

        $secondReceiveResponse
            ->assertOk()
            ->assertJsonPath(
                'data.receipt_status',
                'received'
            );

        $this->assertSame(
            13,
            $product->fresh()->stock
        );

        $this->assertSame(
            '21153.85',
            $product->fresh()->purchase_price
        );

        $this->assertDatabaseCount(
            'inventory_movements',
            1
        );
    }

    public function test_cancelled_purchase_cannot_be_received_and_does_not_change_stock(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $supplier = Supplier::create([
            'name' => 'Cancelled Purchase Supplier',
            'phone' => null,
            'address' => null,
            'notes' => null,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'sku' => 'CANCEL-001',
            'name' => 'Cancelled Purchase Product',
            'purchase_price' => 20000,
            'stock' => 10,
            'is_active' => true,
        ]);

        $createResponse = $this->postJson(
            '/api/purchases',
            [
                'purchase_date' => '2026-07-19',
                'supplier_id' => $supplier->id,
                'receipt_status' => 'draft',
                'paid_amount' => 0,
                'notes' => 'Purchase cancellation test',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => 2,
                        'unit_cost' => 25000,
                    ],
                ],
            ]
        );

        $createResponse->assertCreated();

        $purchaseId = $createResponse->json(
            'data.id'
        );

        $cancelResponse = $this->postJson(
            "/api/purchases/{$purchaseId}/cancel"
        );

        $cancelResponse
            ->assertOk()
            ->assertJsonPath(
                'data.receipt_status',
                'cancelled'
            );

        $this->assertDatabaseHas('purchases', [
            'id' => $purchaseId,
            'receipt_status' => 'cancelled',
            'received_at' => null,
        ]);

        $this->assertSame(
            10,
            $product->fresh()->stock
        );

        $this->assertSame(
            '20000.00',
            $product->fresh()->purchase_price
        );

        $this->assertDatabaseCount(
            'inventory_movements',
            0
        );

        $secondCancelResponse = $this->postJson(
            "/api/purchases/{$purchaseId}/cancel"
        );

        $secondCancelResponse
            ->assertOk()
            ->assertJsonPath(
                'data.receipt_status',
                'cancelled'
            );

        $receiveResponse = $this->postJson(
            "/api/purchases/{$purchaseId}/receive"
        );

        $receiveResponse
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'receipt_status',
            ]);

        $this->assertSame(
            'Cancelled purchase cannot be received.',
            $receiveResponse->json(
                'errors.receipt_status.0'
            )
        );

        $this->assertSame(
            10,
            $product->fresh()->stock
        );

        $this->assertDatabaseCount(
            'inventory_movements',
            0
        );
    }

    public function test_draft_purchase_can_be_updated_without_changing_stock(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $firstSupplier = Supplier::create([
            'name' => 'First Update Supplier',
            'phone' => null,
            'address' => null,
            'notes' => null,
            'is_active' => true,
        ]);

        $secondSupplier = Supplier::create([
            'name' => 'Second Update Supplier',
            'phone' => null,
            'address' => null,
            'notes' => null,
            'is_active' => true,
        ]);

        $firstProduct = Product::factory()->create([
            'sku' => 'UPDATE-001',
            'name' => 'First Update Product',
            'purchase_price' => 10000,
            'stock' => 10,
            'is_active' => true,
        ]);

        $secondProduct = Product::factory()->create([
            'sku' => 'UPDATE-002',
            'name' => 'Second Update Product',
            'purchase_price' => 15000,
            'stock' => 5,
            'is_active' => true,
        ]);

        $createResponse = $this->postJson(
            '/api/purchases',
            [
                'purchase_date' => '2026-07-19',
                'supplier_id' => $firstSupplier->id,
                'receipt_status' => 'draft',
                'paid_amount' => 0,
                'notes' => 'Before update',
                'items' => [
                    [
                        'product_id' => $firstProduct->id,
                        'quantity' => 2,
                        'unit_cost' => 20000,
                    ],
                ],
            ]
        );

        $createResponse
            ->assertCreated()
            ->assertJsonPath(
                'data.total_amount',
                '40000.00'
            );

        $purchaseId = $createResponse->json(
            'data.id'
        );

        $purchaseNo = $createResponse->json(
            'data.purchase_no'
        );

        $updateResponse = $this->patchJson(
            "/api/purchases/{$purchaseId}",
            [
                'purchase_date' => '2026-07-20',
                'supplier_id' => $secondSupplier->id,
                'receipt_status' => 'ordered',
                'paid_amount' => 30000,
                'notes' => 'After update',
                'items' => [
                    [
                        'product_id' => $secondProduct->id,
                        'quantity' => 3,
                        'unit_cost' => 25000,
                    ],
                ],
            ]
        );

        $updateResponse
            ->assertOk()
            ->assertJsonPath(
                'data.purchase_no',
                $purchaseNo
            )
            ->assertJsonPath(
                'data.purchase_date',
                '2026-07-20'
            )
            ->assertJsonPath(
                'data.supplier.id',
                $secondSupplier->id
            )
            ->assertJsonPath(
                'data.receipt_status',
                'ordered'
            )
            ->assertJsonPath(
                'data.payment_status',
                'partial'
            )
            ->assertJsonPath(
                'data.paid_amount',
                '30000.00'
            )
            ->assertJsonPath(
                'data.total_amount',
                '75000.00'
            )
            ->assertJsonPath(
                'data.notes',
                'After update'
            )
            ->assertJsonPath(
                'data.items_count',
                1
            )
            ->assertJsonCount(
                1,
                'data.items'
            )
            ->assertJsonPath(
                'data.items.0.product_id',
                $secondProduct->id
            )
            ->assertJsonPath(
                'data.items.0.quantity',
                3
            )
            ->assertJsonPath(
                'data.items.0.unit_cost',
                '25000.00'
            )
            ->assertJsonPath(
                'data.items.0.subtotal',
                '75000.00'
            );

        $this->assertDatabaseHas('purchases', [
            'id' => $purchaseId,
            'purchase_no' => $purchaseNo,
            'supplier_id' => $secondSupplier->id,
            'receipt_status' => 'ordered',
            'payment_status' => 'partial',
            'paid_amount' => 30000,
            'total_amount' => 75000,
            'notes' => 'After update',
        ]);

        $this->assertDatabaseMissing('purchase_items', [
            'purchase_id' => $purchaseId,
            'product_id' => $firstProduct->id,
        ]);

        $this->assertDatabaseHas('purchase_items', [
            'purchase_id' => $purchaseId,
            'product_id' => $secondProduct->id,
            'product_name' => 'Second Update Product',
            'product_sku' => 'UPDATE-002',
            'quantity' => 3,
            'unit_cost' => 25000,
            'subtotal' => 75000,
        ]);

        $this->assertSame(
            10,
            $firstProduct->fresh()->stock
        );

        $this->assertSame(
            5,
            $secondProduct->fresh()->stock
        );

        $this->assertDatabaseCount(
            'inventory_movements',
            0
        );
    }

    public function test_received_purchase_cannot_be_updated_or_cancelled(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $supplier = Supplier::create([
            'name' => 'Received Lock Supplier',
            'phone' => null,
            'address' => null,
            'notes' => null,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'sku' => 'RECEIVED-LOCK-001',
            'name' => 'Received Lock Product',
            'purchase_price' => 20000,
            'stock' => 10,
            'is_active' => true,
        ]);

        $createResponse = $this->postJson(
            '/api/purchases',
            [
                'purchase_date' => '2026-07-19',
                'supplier_id' => $supplier->id,
                'receipt_status' => 'ordered',
                'paid_amount' => 50000,
                'notes' => 'Received lifecycle test',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => 2,
                        'unit_cost' => 25000,
                    ],
                ],
            ]
        );

        $createResponse->assertCreated();

        $purchaseId = $createResponse->json(
            'data.id'
        );

        $this->postJson(
            "/api/purchases/{$purchaseId}/receive"
        )
            ->assertOk()
            ->assertJsonPath(
                'data.receipt_status',
                'received'
            );

        $this->assertSame(
            12,
            $product->fresh()->stock
        );

        $updateResponse = $this->patchJson(
            "/api/purchases/{$purchaseId}",
            [
                'purchase_date' => '2026-07-20',
                'supplier_id' => $supplier->id,
                'receipt_status' => 'draft',
                'paid_amount' => 0,
                'notes' => 'Attempted edit',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => 5,
                        'unit_cost' => 30000,
                    ],
                ],
            ]
        );

        $updateResponse
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'receipt_status',
            ]);

        $this->assertSame(
            'Received or cancelled purchase cannot be edited.',
            $updateResponse->json(
                'errors.receipt_status.0'
            )
        );

        $cancelResponse = $this->postJson(
            "/api/purchases/{$purchaseId}/cancel"
        );

        $cancelResponse
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'receipt_status',
            ]);

        $this->assertSame(
            'Received purchase cannot be cancelled.',
            $cancelResponse->json(
                'errors.receipt_status.0'
            )
        );

        $this->assertDatabaseHas('purchases', [
            'id' => $purchaseId,
            'receipt_status' => 'received',
            'total_amount' => 50000,
        ]);

        $this->assertDatabaseHas('purchase_items', [
            'purchase_id' => $purchaseId,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_cost' => 25000,
            'subtotal' => 50000,
        ]);

        $this->assertSame(
            12,
            $product->fresh()->stock
        );

        $this->assertDatabaseCount(
            'inventory_movements',
            1
        );
    }
    /**
     * @return array<string, mixed>
     */
    private function purchasePayload(
        int $supplierId,
        int $productId,
        int $paidAmount
    ): array {
        return [
            'purchase_date' => '2026-07-19',
            'supplier_id' => $supplierId,
            'receipt_status' => 'draft',
            'paid_amount' => $paidAmount,
            'notes' => null,
            'items' => [
                [
                    'product_id' => $productId,
                    'quantity' => 2,
                    'unit_cost' => 25000,
                ],
            ],
        ];
    }
}