<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SalesReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],
            'payment_method' => [
                'nullable',
                'string',
                Rule::in([
                    'cash',
                    'qris',
                    'transfer',
                ]),
            ],
            'start_date' => [
                'nullable',
                'date_format:Y-m-d',
            ],
            'end_date' => [
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:start_date',
            ],
            'per_page' => [
                'nullable',
                'integer',
                'min:5',
                'max:50',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'search.max' => 'The search value may not be greater than 255 characters.',
            'payment_method.in' => 'The selected payment method is invalid.',
            'start_date.date_format' => 'The start date must use the Y-m-d format.',
            'end_date.date_format' => 'The end date must use the Y-m-d format.',
            'end_date.after_or_equal' => 'The end date must be on or after the start date.',
            'per_page.min' => 'The per page value must be at least 5.',
            'per_page.max' => 'The per page value may not be greater than 50.',
        ];
    }
}
