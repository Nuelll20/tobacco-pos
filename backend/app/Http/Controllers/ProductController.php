<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\InventoryMovement;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'is_active' => [
                'nullable',
                Rule::in(['true', 'false', '1', '0']),
            ],
            'sort_by' => [
                'nullable',
                'string',
                Rule::in(['name', 'sku', 'stock']),
            ],
            'sort_direction' => [
                'nullable',
                'string',
                Rule::in(['asc', 'desc']),
            ],
        ]);

        $search = $validated['search'] ?? null;
        $perPage = $validated['per_page'] ?? 10;
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';

        $isActive = array_key_exists('is_active', $validated)
            ? filter_var(
                $validated['is_active'],
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            )
            : null;

        $products = Product::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            })
            ->when(
                $isActive !== null,
                fn ($query) => $query->where('is_active', $isActive)
            )
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return ProductResource::collection($products);
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        $openingStock = (int) $data['stock'];
        $data['stock'] = 0;

        $product = DB::transaction(function () use ($data, $openingStock) {
            $product = Product::query()->create($data);

            if ($openingStock > 0) {
                $product->update([
                    'stock' => $openingStock,
                ]);

                InventoryMovement::query()->create([
                    'product_id' => $product->id,
                    'type' => 'stock_in',
                    'quantity' => $openingStock,
                    'stock_before' => 0,
                    'stock_after' => $openingStock,
                    'reference_no' => 'OPENING-' . $product->sku,
                    'note' => 'Opening stock when product was created.',
                ]);
            }

            return $product->fresh();
        });

        return (new ProductResource($product))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Product $product)
    {
        return new ProductResource($product);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return new ProductResource($product->fresh());
    }

    public function destroy(Product $product)
    {
        if ($product->is_active) {
            $product->update([
                'is_active' => false,
            ]);
        }

        return response()->json([
            'message' => 'Product deactivated successfully.',
            'data' => new ProductResource($product->fresh()),
        ]);
    }
}