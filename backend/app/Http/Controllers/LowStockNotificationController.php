<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;

class LowStockNotificationController extends Controller
{
    public function index(): JsonResponse
    {
        $query = Product::query()
            ->where('is_active', true)
            ->whereColumn(
                'stock',
                '<=',
                'minimum_stock'
            );

        $count = (clone $query)->count();

        $items = $query
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
            ->map(function (Product $product): array {
                $stock = (int) $product->stock;

                $minimumStock =
                    (int) $product->minimum_stock;

                return [
                    'id' => $product->id,
                    'sku' => $product->sku,
                    'name' => $product->name,
                    'stock' => $stock,
                    'minimum_stock' => $minimumStock,
                    'stock_shortage' => max(
                        $minimumStock - $stock,
                        0
                    ),
                    'is_out_of_stock' => $stock === 0,
                ];
            })
            ->values();

        return response()->json([
            'data' => [
                'count' => $count,
                'items' => $items,
                'has_more' => $count > $items->count(),
            ],
        ]);
    }
}