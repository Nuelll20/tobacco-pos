<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\InventoryMovementController;
use App\Http\Controllers\ProductController;
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

    Route::apiResource('products', ProductController::class);

    Route::apiResource('inventory-movements', InventoryMovementController::class)
        ->only(['index', 'store', 'show']);

    Route::apiResource('transactions', TransactionController::class)
        ->only(['index', 'store', 'show']);
});
