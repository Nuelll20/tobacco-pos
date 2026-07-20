<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_opnames', function (Blueprint $table) {
            $table->id();

            $table->string('opname_no')->unique();

            $table->enum('status', [
                'draft',
                'finalized',
                'cancelled',
            ])->default('draft');

            $table->date('counted_at');
            $table->text('note')->nullable();
            $table->timestamp('finalized_at')->nullable();

            $table->timestamps();

            $table->index([
                'status',
                'counted_at',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_opnames');
    }
};