<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('purchase_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('product_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('product_name');
            $table->string('product_sku');

            $table->unsignedInteger('quantity');

            $table->decimal('unit_cost', 12, 2);
            $table->decimal('subtotal', 12, 2);

            $table->timestamps();

            $table->index(['purchase_id', 'product_id']);
            $table->index('product_name');
            $table->index('product_sku');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_items');
    }
};