<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryMovementRequest;
use App\Http\Resources\InventoryMovementResource;
use App\Models\InventoryMovement;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryMovementController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $perPage = min(max($perPage, 5), 50);

        $query = InventoryMovement::query()
            ->with('product')
            ->latest();

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->input('product_id'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($query) use ($search) {
                $query
                    ->where('reference_no', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($productQuery) use ($search) {
                        $productQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('sku', 'like', "%{$search}%");
                    });
            });
        }

        $movements = $query->paginate($perPage);

        return InventoryMovementResource::collection($movements);
    }

    public function store(StoreInventoryMovementRequest $request)
    {
        $data = $request->validated();

        $movement = DB::transaction(function () use ($data) {
            $product = Product::query()
                ->lockForUpdate()
                ->findOrFail($data['product_id']);

            $stockBefore = (int) $product->stock;
            $quantity = (int) $data['quantity'];

            $stockAfter = match ($data['type']) {
                'stock_in' => $stockBefore + $quantity,
                'stock_out' => $stockBefore - $quantity,
                'adjustment' => $quantity,
            };

            if ($stockAfter < 0) {
                throw ValidationException::withMessages([
                    'quantity' => ['Stock is not enough for this stock out.'],
                ]);
            }

            $product->update([
                'stock' => $stockAfter,
            ]);

            return InventoryMovement::create([
                'product_id' => $product->id,
                'type' => $data['type'],
                'quantity' => $quantity,
                'stock_before' => $stockBefore,
                'stock_after' => $stockAfter,
                'reference_no' => $data['reference_no'] ?? null,
                'note' => $data['note'] ?? null,
            ]);
        });

        return (new InventoryMovementResource($movement->load('product')))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(InventoryMovement $inventoryMovement)
    {
        return new InventoryMovementResource($inventoryMovement->load('product'));
    }
}