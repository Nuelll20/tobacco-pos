<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();

            $table->string('purchase_no')->unique();

            $table->foreignId('supplier_id')
                ->constrained()
                ->restrictOnDelete();

            $table->date('purchase_date');

            $table->enum('receipt_status', [
                'draft',
                'ordered',
                'received',
                'cancelled',
            ])->default('draft');

            $table->enum('payment_status', [
                'unpaid',
                'partial',
                'paid',
            ])->default('unpaid');

            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);

            $table->text('notes')->nullable();
            $table->timestamp('received_at')->nullable();

            $table->timestamps();

            $table->index('purchase_date');
            $table->index(['supplier_id', 'purchase_date']);
            $table->index(['receipt_status', 'purchase_date']);
            $table->index(['payment_status', 'purchase_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};