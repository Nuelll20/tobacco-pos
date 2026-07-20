<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LowStockNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_low_stock_notification_requires_authentication(): void
    {
        $response = $this->getJson(
            '/api/notifications/low-stock'
        );

        $response->assertUnauthorized();
    }

    public function test_it_returns_active_low_stock_products_and_total_count(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $this->createProduct(
            sku: 'LOW-002',
            name: 'Zero Beta',
            stock: 0,
            minimumStock: 3
        );

        $this->createProduct(
            sku: 'LOW-001',
            name: 'Zero Alpha',
            stock: 0,
            minimumStock: 5
        );

        $this->createProduct(
            sku: 'LOW-003',
            name: 'Low One',
            stock: 1,
            minimumStock: 2
        );

        $this->createProduct(
            sku: 'LOW-004',
            name: 'Low Two',
            stock: 2,
            minimumStock: 2
        );

        $this->createProduct(
            sku: 'LOW-005',
            name: 'Low Three',
            stock: 3,
            minimumStock: 4
        );

        $this->createProduct(
            sku: 'LOW-006',
            name: 'Low Four',
            stock: 4,
            minimumStock: 5
        );

        $this->createProduct(
            sku: 'LOW-007',
            name: 'Low Five',
            stock: 5,
            minimumStock: 5
        );

        $this->createProduct(
            sku: 'OK-001',
            name: 'Healthy Product',
            stock: 6,
            minimumStock: 5
        );

        $this->createProduct(
            sku: 'OFF-001',
            name: 'Inactive Product',
            stock: 0,
            minimumStock: 10,
            isActive: false
        );

        $response = $this->getJson(
            '/api/notifications/low-stock'
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.count',
                7
            )
            ->assertJsonPath(
                'data.has_more',
                true
            )
            ->assertJsonCount(
                5,
                'data.items'
            )
            ->assertJsonPath(
                'data.items.0.name',
                'Zero Alpha'
            )
            ->assertJsonPath(
                'data.items.0.stock',
                0
            )
            ->assertJsonPath(
                'data.items.0.minimum_stock',
                5
            )
            ->assertJsonPath(
                'data.items.0.stock_shortage',
                5
            )
            ->assertJsonPath(
                'data.items.0.is_out_of_stock',
                true
            )
            ->assertJsonPath(
                'data.items.1.name',
                'Zero Beta'
            )
            ->assertJsonPath(
                'data.items.2.name',
                'Low One'
            )
            ->assertJsonPath(
                'data.items.3.name',
                'Low Two'
            )
            ->assertJsonPath(
                'data.items.4.name',
                'Low Three'
            );

        $response->assertJsonMissing([
            'name' => 'Healthy Product',
        ]);

        $response->assertJsonMissing([
            'name' => 'Inactive Product',
        ]);
    }

    private function createProduct(
        string $sku,
        string $name,
        int $stock,
        int $minimumStock,
        bool $isActive = true
    ): Product {
        return Product::query()->create([
            'sku' => $sku,
            'name' => $name,
            'purchase_price' => 10000,
            'selling_price' => 15000,
            'stock' => $stock,
            'minimum_stock' => $minimumStock,
            'is_active' => $isActive,
        ]);
    }
}