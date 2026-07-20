<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StockOpnameTest extends TestCase
{
    use RefreshDatabase;

    public function test_stock_opname_endpoints_require_authentication(): void
    {
        $this->getJson('/api/stock-opnames')
            ->assertUnauthorized();

        $this->postJson('/api/stock-opnames', [])
            ->assertUnauthorized();
    }

    public function test_authenticated_user_can_create_draft_without_changing_stock(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $firstProduct = Product::factory()->create([
            'sku' => 'OPNAME-001',
            'name' => 'Stock Opname Product One',
            'stock' => 10,
            'is_active' => true,
        ]);

        $secondProduct = Product::factory()->create([
            'sku' => 'OPNAME-002',
            'name' => 'Stock Opname Product Two',
            'stock' => 5,
            'is_active' => true,
        ]);

        $response = $this->postJson(
            '/api/stock-opnames',
            [
                'counted_at' => '2026-07-20',
                'note' => 'Opname akhir shift',
                'items' => [
                    [
                        'product_id' =>
                            $firstProduct->id,
                        'counted_stock' => 8,
                        'note' =>
                            'Kurang dua unit',
                    ],
                    [
                        'product_id' =>
                            $secondProduct->id,
                        'counted_stock' => 7,
                        'note' =>
                            'Lebih dua unit',
                    ],
                ],
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath(
                'data.status',
                'draft'
            )
            ->assertJsonPath(
                'data.counted_at',
                '2026-07-20'
            )
            ->assertJsonPath(
                'data.note',
                'Opname akhir shift'
            )
            ->assertJsonPath(
                'data.items_count',
                2
            )
            ->assertJsonCount(
                2,
                'data.items'
            )
            ->assertJsonPath(
                'data.items.0.product_id',
                $firstProduct->id
            )
            ->assertJsonPath(
                'data.items.0.system_stock',
                10
            )
            ->assertJsonPath(
                'data.items.0.counted_stock',
                8
            )
            ->assertJsonPath(
                'data.items.0.difference',
                -2
            )
            ->assertJsonPath(
                'data.items.1.product_id',
                $secondProduct->id
            )
            ->assertJsonPath(
                'data.items.1.system_stock',
                5
            )
            ->assertJsonPath(
                'data.items.1.counted_stock',
                7
            )
            ->assertJsonPath(
                'data.items.1.difference',
                2
            );

        $stockOpnameId = $response->json(
            'data.id'
        );

        $opnameNo = $response->json(
            'data.opname_no'
        );

        $this->assertMatchesRegularExpression(
            '/^OPN-\d{6}-0001$/',
            $opnameNo
        );

        $this->assertDatabaseHas(
            'stock_opnames',
            [
                'id' => $stockOpnameId,
                'opname_no' => $opnameNo,
                'status' => 'draft',
                'counted_at' => '2026-07-20 00:00:00',
                'note' => 'Opname akhir shift',
                'finalized_at' => null,
            ]
        );

        $this->assertDatabaseHas(
            'stock_opname_items',
            [
                'stock_opname_id' =>
                    $stockOpnameId,
                'product_id' =>
                    $firstProduct->id,
                'product_name' =>
                    'Stock Opname Product One',
                'product_sku' =>
                    'OPNAME-001',
                'system_stock' => 10,
                'counted_stock' => 8,
                'difference' => -2,
                'note' => 'Kurang dua unit',
            ]
        );

        $this->assertDatabaseHas(
            'stock_opname_items',
            [
                'stock_opname_id' =>
                    $stockOpnameId,
                'product_id' =>
                    $secondProduct->id,
                'product_name' =>
                    'Stock Opname Product Two',
                'product_sku' =>
                    'OPNAME-002',
                'system_stock' => 5,
                'counted_stock' => 7,
                'difference' => 2,
                'note' => 'Lebih dua unit',
            ]
        );

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

    public function test_draft_stock_opname_can_be_updated_and_refreshes_system_stock(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $product = Product::factory()->create([
            'sku' => 'OPNAME-UPDATE-001',
            'name' => 'Stock Opname Update Product',
            'stock' => 10,
            'is_active' => true,
        ]);

        $createResponse = $this->postJson(
            '/api/stock-opnames',
            [
                'counted_at' => '2026-07-20 00:00:00',
                'note' => 'Before update',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'counted_stock' => 8,
                        'note' => 'Initial count',
                    ],
                ],
            ]
        );

        $createResponse
            ->assertCreated()
            ->assertJsonPath(
                'data.items.0.system_stock',
                10
            )
            ->assertJsonPath(
                'data.items.0.counted_stock',
                8
            )
            ->assertJsonPath(
                'data.items.0.difference',
                -2
            );

        $stockOpnameId = $createResponse->json(
            'data.id'
        );

        $opnameNo = $createResponse->json(
            'data.opname_no'
        );

        $product->update([
            'stock' => 12,
        ]);

        $updateResponse = $this->patchJson(
            "/api/stock-opnames/{$stockOpnameId}",
            [
                'counted_at' => '2026-07-21',
                'note' => 'After update',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'counted_stock' => 11,
                        'note' => 'Updated count',
                    ],
                ],
            ]
        );

        $updateResponse
            ->assertOk()
            ->assertJsonPath(
                'data.opname_no',
                $opnameNo
            )
            ->assertJsonPath(
                'data.status',
                'draft'
            )
            ->assertJsonPath(
                'data.counted_at',
                '2026-07-21'
            )
            ->assertJsonPath(
                'data.note',
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
                $product->id
            )
            ->assertJsonPath(
                'data.items.0.system_stock',
                12
            )
            ->assertJsonPath(
                'data.items.0.counted_stock',
                11
            )
            ->assertJsonPath(
                'data.items.0.difference',
                -1
            )
            ->assertJsonPath(
                'data.items.0.note',
                'Updated count'
            );

        $this->assertDatabaseHas(
            'stock_opnames',
            [
                'id' => $stockOpnameId,
                'opname_no' => $opnameNo,
                'status' => 'draft',
                'counted_at' => '2026-07-21 00:00:00',
                'note' => 'After update',
                'finalized_at' => null,
            ]
        );

        $this->assertDatabaseHas(
            'stock_opname_items',
            [
                'stock_opname_id' => $stockOpnameId,
                'product_id' => $product->id,
                'product_name' =>
                    'Stock Opname Update Product',
                'product_sku' =>
                    'OPNAME-UPDATE-001',
                'system_stock' => 12,
                'counted_stock' => 11,
                'difference' => -1,
                'note' => 'Updated count',
            ]
        );

        $this->assertSame(
            12,
            $product->fresh()->stock
        );

        $this->assertDatabaseCount(
            'stock_opname_items',
            1
        );

        $this->assertDatabaseCount(
            'inventory_movements',
            0
        );
    }
    public function test_draft_stock_opname_can_be_finalized_once_and_updates_stock(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $differentProduct = Product::factory()->create([
            'sku' => 'OPNAME-FINALIZE-001',
            'name' => 'Different Stock Product',
            'stock' => 10,
            'is_active' => true,
        ]);

        $matchingProduct = Product::factory()->create([
            'sku' => 'OPNAME-FINALIZE-002',
            'name' => 'Matching Stock Product',
            'stock' => 5,
            'is_active' => true,
        ]);

        $createResponse = $this->postJson(
            '/api/stock-opnames',
            [
                'counted_at' => '2026-07-20',
                'note' => 'Finalize test',
                'items' => [
                    [
                        'product_id' =>
                            $differentProduct->id,
                        'counted_stock' => 8,
                        'note' => 'Missing two units',
                    ],
                    [
                        'product_id' =>
                            $matchingProduct->id,
                        'counted_stock' => 5,
                        'note' => null,
                    ],
                ],
            ]
        );

        $createResponse
            ->assertCreated()
            ->assertJsonPath(
                'data.status',
                'draft'
            );

        $stockOpnameId = $createResponse->json(
            'data.id'
        );

        $opnameNo = $createResponse->json(
            'data.opname_no'
        );

        $finalizeResponse = $this->postJson(
            "/api/stock-opnames/{$stockOpnameId}/finalize"
        );

        $finalizeResponse
            ->assertOk()
            ->assertJsonPath(
                'data.status',
                'finalized'
            )
            ->assertJsonPath(
                'data.items_count',
                2
            )
            ->assertJsonPath(
                'data.items.0.system_stock',
                10
            )
            ->assertJsonPath(
                'data.items.0.counted_stock',
                8
            )
            ->assertJsonPath(
                'data.items.0.difference',
                -2
            )
            ->assertJsonPath(
                'data.items.1.system_stock',
                5
            )
            ->assertJsonPath(
                'data.items.1.counted_stock',
                5
            )
            ->assertJsonPath(
                'data.items.1.difference',
                0
            );

        $this->assertNotNull(
            $finalizeResponse->json(
                'data.finalized_at'
            )
        );

        $this->assertSame(
            8,
            $differentProduct->fresh()->stock
        );

        $this->assertSame(
            5,
            $matchingProduct->fresh()->stock
        );

        $this->assertDatabaseHas(
            'stock_opnames',
            [
                'id' => $stockOpnameId,
                'opname_no' => $opnameNo,
                'status' => 'finalized',
            ]
        );

        $this->assertDatabaseHas(
            'inventory_movements',
            [
                'product_id' =>
                    $differentProduct->id,
                'type' => 'adjustment',
                'quantity' => 8,
                'stock_before' => 10,
                'stock_after' => 8,
                'reference_no' => $opnameNo,
                'note' =>
                    'Stock adjustment from stock opname.',
            ]
        );

        $this->assertDatabaseMissing(
            'inventory_movements',
            [
                'product_id' =>
                    $matchingProduct->id,
                'reference_no' => $opnameNo,
            ]
        );

        $this->assertDatabaseCount(
            'inventory_movements',
            1
        );

        $secondFinalizeResponse = $this->postJson(
            "/api/stock-opnames/{$stockOpnameId}/finalize"
        );

        $secondFinalizeResponse
            ->assertOk()
            ->assertJsonPath(
                'data.status',
                'finalized'
            );

        $this->assertSame(
            8,
            $differentProduct->fresh()->stock
        );

        $this->assertSame(
            5,
            $matchingProduct->fresh()->stock
        );

        $this->assertDatabaseCount(
            'inventory_movements',
            1
        );
    }
    public function test_stock_opname_cannot_be_finalized_when_product_stock_has_changed(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $firstProduct = Product::factory()->create([
            'sku' => 'OPNAME-STALE-001',
            'name' => 'First Stale Stock Product',
            'stock' => 10,
            'is_active' => true,
        ]);

        $secondProduct = Product::factory()->create([
            'sku' => 'OPNAME-STALE-002',
            'name' => 'Second Stale Stock Product',
            'stock' => 5,
            'is_active' => true,
        ]);

        $createResponse = $this->postJson(
            '/api/stock-opnames',
            [
                'counted_at' => '2026-07-20',
                'note' => 'Stale stock test',
                'items' => [
                    [
                        'product_id' =>
                            $firstProduct->id,
                        'counted_stock' => 8,
                        'note' => null,
                    ],
                    [
                        'product_id' =>
                            $secondProduct->id,
                        'counted_stock' => 4,
                        'note' => null,
                    ],
                ],
            ]
        );

        $createResponse
            ->assertCreated()
            ->assertJsonPath(
                'data.status',
                'draft'
            );

        $stockOpnameId = $createResponse->json(
            'data.id'
        );

        $secondProduct->update([
            'stock' => 7,
        ]);

        $finalizeResponse = $this->postJson(
            "/api/stock-opnames/{$stockOpnameId}/finalize"
        );

        $finalizeResponse
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'items',
            ]);

        $this->assertSame(
            'Stock for one or more products has changed since this stock opname was saved. Update the draft before finalizing.',
            $finalizeResponse->json(
                'errors.items.0'
            )
        );

        $this->assertSame(
            10,
            $firstProduct->fresh()->stock
        );

        $this->assertSame(
            7,
            $secondProduct->fresh()->stock
        );

        $this->assertDatabaseHas(
            'stock_opnames',
            [
                'id' => $stockOpnameId,
                'status' => 'draft',
                'finalized_at' => null,
            ]
        );

        $this->assertDatabaseCount(
            'inventory_movements',
            0
        );
    }
    public function test_cancelled_stock_opname_cannot_be_finalized_or_edited(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $product = Product::factory()->create([
            'sku' => 'OPNAME-CANCEL-001',
            'name' => 'Cancelled Stock Opname Product',
            'stock' => 10,
            'is_active' => true,
        ]);

        $createResponse = $this->postJson(
            '/api/stock-opnames',
            [
                'counted_at' => '2026-07-20',
                'note' => 'Cancellation test',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'counted_stock' => 8,
                        'note' => null,
                    ],
                ],
            ]
        );

        $createResponse
            ->assertCreated()
            ->assertJsonPath(
                'data.status',
                'draft'
            );

        $stockOpnameId = $createResponse->json(
            'data.id'
        );

        $cancelResponse = $this->postJson(
            "/api/stock-opnames/{$stockOpnameId}/cancel"
        );

        $cancelResponse
            ->assertOk()
            ->assertJsonPath(
                'data.status',
                'cancelled'
            );

        $secondCancelResponse = $this->postJson(
            "/api/stock-opnames/{$stockOpnameId}/cancel"
        );

        $secondCancelResponse
            ->assertOk()
            ->assertJsonPath(
                'data.status',
                'cancelled'
            );

        $finalizeResponse = $this->postJson(
            "/api/stock-opnames/{$stockOpnameId}/finalize"
        );

        $finalizeResponse
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'status',
            ]);

        $this->assertSame(
            'Cancelled stock opname cannot be finalized.',
            $finalizeResponse->json(
                'errors.status.0'
            )
        );

        $updateResponse = $this->patchJson(
            "/api/stock-opnames/{$stockOpnameId}",
            [
                'counted_at' => '2026-07-21',
                'note' => 'Attempted edit',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'counted_stock' => 6,
                        'note' => null,
                    ],
                ],
            ]
        );

        $updateResponse
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'status',
            ]);

        $this->assertSame(
            'Only draft stock opname can be edited.',
            $updateResponse->json(
                'errors.status.0'
            )
        );

        $this->assertDatabaseHas(
            'stock_opnames',
            [
                'id' => $stockOpnameId,
                'status' => 'cancelled',
                'note' => 'Cancellation test',
                'finalized_at' => null,
            ]
        );

        $this->assertDatabaseHas(
            'stock_opname_items',
            [
                'stock_opname_id' => $stockOpnameId,
                'product_id' => $product->id,
                'system_stock' => 10,
                'counted_stock' => 8,
                'difference' => -2,
            ]
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
    public function test_finalized_stock_opname_cannot_be_edited_or_cancelled(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $product = Product::factory()->create([
            'sku' => 'OPNAME-FINAL-LOCK-001',
            'name' => 'Finalized Stock Opname Product',
            'stock' => 10,
            'is_active' => true,
        ]);

        $createResponse = $this->postJson(
            '/api/stock-opnames',
            [
                'counted_at' => '2026-07-20',
                'note' => 'Final lifecycle test',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'counted_stock' => 8,
                        'note' => null,
                    ],
                ],
            ]
        );

        $createResponse->assertCreated();

        $stockOpnameId = $createResponse->json(
            'data.id'
        );

        $opnameNo = $createResponse->json(
            'data.opname_no'
        );

        $this->postJson(
            "/api/stock-opnames/{$stockOpnameId}/finalize"
        )
            ->assertOk()
            ->assertJsonPath(
                'data.status',
                'finalized'
            );

        $this->assertSame(
            8,
            $product->fresh()->stock
        );

        $this->assertDatabaseCount(
            'inventory_movements',
            1
        );

        $updateResponse = $this->patchJson(
            "/api/stock-opnames/{$stockOpnameId}",
            [
                'counted_at' => '2026-07-21',
                'note' => 'Attempted finalized edit',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'counted_stock' => 6,
                        'note' => null,
                    ],
                ],
            ]
        );

        $updateResponse
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'status',
            ]);

        $this->assertSame(
            'Only draft stock opname can be edited.',
            $updateResponse->json(
                'errors.status.0'
            )
        );

        $cancelResponse = $this->postJson(
            "/api/stock-opnames/{$stockOpnameId}/cancel"
        );

        $cancelResponse
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'status',
            ]);

        $this->assertSame(
            'Finalized stock opname cannot be cancelled.',
            $cancelResponse->json(
                'errors.status.0'
            )
        );

        $this->assertDatabaseHas(
            'stock_opnames',
            [
                'id' => $stockOpnameId,
                'opname_no' => $opnameNo,
                'status' => 'finalized',
                'note' => 'Final lifecycle test',
            ]
        );

        $this->assertDatabaseHas(
            'stock_opname_items',
            [
                'stock_opname_id' => $stockOpnameId,
                'product_id' => $product->id,
                'system_stock' => 10,
                'counted_stock' => 8,
                'difference' => -2,
            ]
        );

        $this->assertDatabaseHas(
            'inventory_movements',
            [
                'product_id' => $product->id,
                'type' => 'adjustment',
                'quantity' => 8,
                'stock_before' => 10,
                'stock_after' => 8,
                'reference_no' => $opnameNo,
            ]
        );

        $this->assertSame(
            8,
            $product->fresh()->stock
        );

        $this->assertDatabaseCount(
            'inventory_movements',
            1
        );
    }
    public function test_stock_opname_list_supports_search_status_filter_and_detail(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $firstProduct = Product::factory()->create([
            'sku' => 'OPNAME-SEARCH-ONE',
            'name' => 'First Search Opname Product',
            'stock' => 10,
            'is_active' => true,
        ]);

        $secondProduct = Product::factory()->create([
            'sku' => 'OPNAME-SEARCH-TWO',
            'name' => 'Second Search Opname Product',
            'stock' => 5,
            'is_active' => true,
        ]);

        $firstCreateResponse = $this->postJson(
            '/api/stock-opnames',
            [
                'counted_at' => '2026-07-20',
                'note' => 'Finalized search opname',
                'items' => [
                    [
                        'product_id' => $firstProduct->id,
                        'counted_stock' => 10,
                        'note' => null,
                    ],
                ],
            ]
        );

        $firstCreateResponse->assertCreated();

        $firstStockOpnameId = $firstCreateResponse->json(
            'data.id'
        );

        $this->postJson(
            "/api/stock-opnames/{$firstStockOpnameId}/finalize"
        )
            ->assertOk()
            ->assertJsonPath(
                'data.status',
                'finalized'
            );

        $secondCreateResponse = $this->postJson(
            '/api/stock-opnames',
            [
                'counted_at' => '2026-07-21',
                'note' => 'Draft search opname',
                'items' => [
                    [
                        'product_id' => $secondProduct->id,
                        'counted_stock' => 4,
                        'note' => 'Draft item note',
                    ],
                ],
            ]
        );

        $secondCreateResponse
            ->assertCreated()
            ->assertJsonPath(
                'data.status',
                'draft'
            );

        $secondStockOpnameId = $secondCreateResponse->json(
            'data.id'
        );

        $searchResponse = $this->getJson(
            '/api/stock-opnames?search=OPNAME-SEARCH-ONE'
        );

        $searchResponse
            ->assertOk()
            ->assertJsonCount(
                1,
                'data'
            )
            ->assertJsonPath(
                'data.0.id',
                $firstStockOpnameId
            )
            ->assertJsonPath(
                'data.0.status',
                'finalized'
            )
            ->assertJsonPath(
                'data.0.items_count',
                1
            );

        $statusResponse = $this->getJson(
            '/api/stock-opnames?status=draft'
        );

        $statusResponse
            ->assertOk()
            ->assertJsonCount(
                1,
                'data'
            )
            ->assertJsonPath(
                'data.0.id',
                $secondStockOpnameId
            )
            ->assertJsonPath(
                'data.0.status',
                'draft'
            )
            ->assertJsonPath(
                'data.0.items_count',
                1
            );

        $detailResponse = $this->getJson(
            "/api/stock-opnames/{$secondStockOpnameId}"
        );

        $detailResponse
            ->assertOk()
            ->assertJsonPath(
                'data.id',
                $secondStockOpnameId
            )
            ->assertJsonPath(
                'data.status',
                'draft'
            )
            ->assertJsonPath(
                'data.counted_at',
                '2026-07-21'
            )
            ->assertJsonPath(
                'data.note',
                'Draft search opname'
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
                'data.items.0.product_name',
                'Second Search Opname Product'
            )
            ->assertJsonPath(
                'data.items.0.product_sku',
                'OPNAME-SEARCH-TWO'
            )
            ->assertJsonPath(
                'data.items.0.system_stock',
                5
            )
            ->assertJsonPath(
                'data.items.0.counted_stock',
                4
            )
            ->assertJsonPath(
                'data.items.0.difference',
                -1
            )
            ->assertJsonPath(
                'data.items.0.note',
                'Draft item note'
            );
    }}