<?php

namespace Tests\Feature;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SupplierTest extends TestCase
{
    use RefreshDatabase;

    public function test_supplier_endpoints_require_authentication(): void
    {
        $this->getJson('/api/suppliers')
            ->assertUnauthorized();

        $this->postJson('/api/suppliers', [
            'name' => 'Unauthorized Supplier',
            'is_active' => true,
        ])->assertUnauthorized();
    }

    public function test_authenticated_user_can_create_supplier(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $response = $this->postJson('/api/suppliers', [
            'name' => 'PT Sumber Tobacco',
            'phone' => '081234567890',
            'address' => 'Jakarta',
            'notes' => 'Supplier utama',
            'is_active' => true,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath(
                'data.name',
                'PT Sumber Tobacco'
            )
            ->assertJsonPath(
                'data.phone',
                '081234567890'
            )
            ->assertJsonPath(
                'data.address',
                'Jakarta'
            )
            ->assertJsonPath(
                'data.notes',
                'Supplier utama'
            )
            ->assertJsonPath(
                'data.is_active',
                true
            );

        $this->assertDatabaseHas('suppliers', [
            'name' => 'PT Sumber Tobacco',
            'phone' => '081234567890',
            'is_active' => true,
        ]);
    }

    public function test_supplier_list_supports_search_and_status_filter(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        Supplier::create([
            'name' => 'Alpha Distributor',
            'phone' => '081111111111',
            'address' => 'Bandung',
            'notes' => null,
            'is_active' => true,
        ]);

        Supplier::create([
            'name' => 'Beta Grosir',
            'phone' => '082222222222',
            'address' => 'Jakarta',
            'notes' => null,
            'is_active' => false,
        ]);

        Supplier::create([
            'name' => 'Gamma Supplier',
            'phone' => '083333333333',
            'address' => 'Surabaya',
            'notes' => null,
            'is_active' => true,
        ]);

        $searchResponse = $this->getJson(
            '/api/suppliers?search=Alpha'
        );

        $searchResponse
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath(
                'data.0.name',
                'Alpha Distributor'
            );

        $statusResponse = $this->getJson(
            '/api/suppliers?is_active=0'
        );

        $statusResponse
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath(
                'data.0.name',
                'Beta Grosir'
            )
            ->assertJsonPath(
                'data.0.is_active',
                false
            );
    }

    public function test_authenticated_user_can_update_supplier(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $supplier = Supplier::create([
            'name' => 'Supplier Lama',
            'phone' => null,
            'address' => null,
            'notes' => null,
            'is_active' => true,
        ]);

        $response = $this->patchJson(
            "/api/suppliers/{$supplier->id}",
            [
                'name' => 'Supplier Baru',
                'phone' => '089999999999',
                'address' => 'Semarang',
                'notes' => 'Data diperbarui',
                'is_active' => true,
            ]
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.name',
                'Supplier Baru'
            )
            ->assertJsonPath(
                'data.phone',
                '089999999999'
            );

        $this->assertDatabaseHas('suppliers', [
            'id' => $supplier->id,
            'name' => 'Supplier Baru',
            'phone' => '089999999999',
            'address' => 'Semarang',
            'is_active' => true,
        ]);
    }

    public function test_delete_endpoint_deactivates_supplier_without_deleting_it(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $supplier = Supplier::create([
            'name' => 'Supplier Aktif',
            'phone' => null,
            'address' => null,
            'notes' => null,
            'is_active' => true,
        ]);

        $response = $this->deleteJson(
            "/api/suppliers/{$supplier->id}"
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'message',
                'Supplier deactivated successfully'
            );

        $this->assertDatabaseHas('suppliers', [
            'id' => $supplier->id,
            'name' => 'Supplier Aktif',
            'is_active' => false,
        ]);

        $this->assertDatabaseCount('suppliers', 1);
    }

    public function test_supplier_payload_and_filters_are_validated(): void
    {
        Sanctum::actingAs(
            User::factory()->create()
        );

        $this->postJson('/api/suppliers', [
            'name' => '',
            'phone' => str_repeat('1', 51),
            'is_active' => 'active',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'phone',
                'is_active',
            ]);

        $this->getJson(
            '/api/suppliers?per_page=101'
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'per_page',
            ]);

        $this->getJson(
            '/api/suppliers?sort_by=phone'
        )
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'sort_by',
            ]);
    }
}
