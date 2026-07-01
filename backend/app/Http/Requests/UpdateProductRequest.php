<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sku' => [
                'required',
                'string',
                'max:100',
                Rule::unique('products', 'sku')->ignore($this->route('product')),
            ],

            'name' => ['required', 'string', 'max:255'],

            'purchase_price' => ['required', 'numeric', 'min:0'],

            'selling_price' => ['required', 'numeric', 'gte:purchase_price'],

            'stock' => ['required', 'integer', 'min:0'],

            'minimum_stock' => ['required', 'integer', 'min:0'],

            'is_active' => ['required', 'boolean'],
        ];
    }
}