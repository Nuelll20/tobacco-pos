<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $purchasePrice = fake()->numberBetween(10000, 50000);

        return [
            'sku' => strtoupper(fake()->unique()->bothify('SKU###')),

            'name' => fake()->randomElement([
                'Gudang Garam Merah',
                'Gudang Garam Filter',
                'Djarum Super',
                'Djarum Black',
                'Sampoerna Mild',
                'Sampoerna Kretek',
                'Marlboro Red',
                'Marlboro White',
                'Esse Berry Pop',
                'Camel Filter',
            ]),

            'purchase_price' => $purchasePrice,

            'selling_price' => $purchasePrice + fake()->numberBetween(2000, 10000),

            'stock' => fake()->numberBetween(0, 200),

            'minimum_stock' => fake()->numberBetween(5, 20),

            'is_active' => true,
        ];
    }
}