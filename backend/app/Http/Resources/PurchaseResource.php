<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'purchase_no' => $this->purchase_no,
            'purchase_date' => $this->purchase_date?->format('Y-m-d'),

            'supplier_id' => $this->supplier_id,
            'supplier' => new SupplierResource(
                $this->whenLoaded('supplier')
            ),

            'receipt_status' => $this->receipt_status,
            'payment_status' => $this->payment_status,

            'paid_amount' => $this->paid_amount,
            'total_amount' => $this->total_amount,

            'notes' => $this->notes,
            'received_at' => $this->received_at,

            'items_count' => $this->whenCounted('items'),
            'items' => PurchaseItemResource::collection(
                $this->whenLoaded('items')
            ),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}