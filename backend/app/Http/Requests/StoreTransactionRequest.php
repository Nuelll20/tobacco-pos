<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_method' => [
                'required',
                Rule::in(['cash', 'qris', 'transfer']),
            ],
            'paid_amount' => [
                'required',
                'numeric',
                'decimal:0,2',
                'min:0',
            ],
            'note' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'items' => [
                'required',
                'array',
                'min:1',
                'max:100',
            ],
            'items.*' => [
                'required',
                'array',
            ],
            'items.*.product_id' => [
                'required',
                'integer',
                'distinct',
                'exists:products,id',
            ],
            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ];
    }
}
