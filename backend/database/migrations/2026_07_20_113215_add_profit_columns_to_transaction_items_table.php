<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'transaction_items',
            function (Blueprint $table) {
                $table
                    ->decimal('unit_cost', 12, 2)
                    ->nullable();

                $table
                    ->decimal('cost_subtotal', 12, 2)
                    ->nullable();

                $table
                    ->decimal('gross_profit', 12, 2)
                    ->nullable();
            }
        );
    }

    public function down(): void
    {
        Schema::table(
            'transaction_items',
            function (Blueprint $table) {
                $table->dropColumn([
                    'unit_cost',
                    'cost_subtotal',
                    'gross_profit',
                ]);
            }
        );
    }
};