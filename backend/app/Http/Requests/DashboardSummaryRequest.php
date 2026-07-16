<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DashboardSummaryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'period' => [
                'nullable',
                'string',
                Rule::in([
                    'today',
                    '7_days',
                    '30_days',
                    'custom',
                ]),
            ],
            'start_date' => [
                'nullable',
                'required_if:period,custom',
                'date_format:Y-m-d',
            ],
            'end_date' => [
                'nullable',
                'required_if:period,custom',
                'date_format:Y-m-d',
                'after_or_equal:start_date',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'period.in' => 'The selected dashboard period is invalid.',
            'start_date.required_if' => 'The start date is required for a custom period.',
            'start_date.date_format' => 'The start date must use the Y-m-d format.',
            'end_date.required_if' => 'The end date is required for a custom period.',
            'end_date.date_format' => 'The end date must use the Y-m-d format.',
            'end_date.after_or_equal' => 'The end date must be on or after the start date.',
        ];
    }
}
