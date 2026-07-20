<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockOpnameResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'opname_no' => $this->opname_no,
            'status' => $this->status,
            'counted_at' => $this->counted_at?->format('Y-m-d'),
            'note' => $this->note,
            'finalized_at' => $this->finalized_at?->toISOString(),

            'items_count' => $this->whenCounted('items'),

            'items' => StockOpnameItemResource::collection(
                $this->whenLoaded('items')
            ),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}