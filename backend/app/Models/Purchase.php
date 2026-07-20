<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_no',
        'purchase_date',
        'supplier_id',
        'receipt_status',
        'payment_status',
        'paid_amount',
        'total_amount',
        'notes',
        'received_at',
    ];

    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
            'paid_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'received_at' => 'datetime',
        ];
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseItem::class);
    }
}