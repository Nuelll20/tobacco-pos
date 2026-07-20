<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_opname_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('stock_opname_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('product_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('product_name');
            $table->string('product_sku');

            $table->unsignedInteger('system_stock');
            $table->unsignedInteger('counted_stock');

            $table->integer('difference');

            $table->text('note')->nullable();

            $table->timestamps();

            $table->unique([
                'stock_opname_id',
                'product_id',
            ]);

            $table->index([
                'stock_opname_id',
                'difference',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_opname_items');
    }
};