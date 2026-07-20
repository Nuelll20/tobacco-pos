<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryMovementController;
use App\Http\Controllers\LowStockNotificationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SalesReportController;
use App\Http\Controllers\StockOpnameController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'message' => 'API is working',
    ]);
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get(
        '/dashboard/summary',
        [DashboardController::class, 'summary']
    );

    Route::get(
        '/notifications/low-stock',
        [LowStockNotificationController::class, 'index']
    );

    Route::get(
        '/reports/sales',
        [SalesReportController::class, 'index']
    );

    Route::apiResource('products', ProductController::class);

    Route::apiResource('suppliers', SupplierController::class);

    Route::post(
        '/purchases/{purchase}/receive',
        [PurchaseController::class, 'receive']
    );

    Route::post(
        '/purchases/{purchase}/cancel',
        [PurchaseController::class, 'cancel']
    );

    Route::apiResource('purchases', PurchaseController::class)
        ->only(['index', 'store', 'show', 'update']);

    Route::apiResource('inventory-movements', InventoryMovementController::class)
        ->only(['index', 'store', 'show', 'update']);

    Route::post(
        '/stock-opnames/{stockOpname}/finalize',
        [StockOpnameController::class, 'finalize']
    );

    Route::post(
        '/stock-opnames/{stockOpname}/cancel',
        [StockOpnameController::class, 'cancel']
    );

    Route::apiResource('stock-opnames', StockOpnameController::class)
        ->parameters([
            'stock-opnames' => 'stockOpname',
        ])
        ->only([
            'index',
            'store',
            'show',
            'update',
        ]);

    Route::apiResource('transactions', TransactionController::class)
        ->only(['index', 'store', 'show', 'update']);
});
