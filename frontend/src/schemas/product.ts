import { z } from "zod";

export const productSchema = z.object({
  sku: z
    .string()
    .min(
      1,
      "products.validation.skuRequired",
    ),

  name: z
    .string()
    .min(
      1,
      "products.validation.nameRequired",
    ),

  purchase_price: z
    .number()
    .min(
      1,
      "products.validation.purchasePriceRequired",
    ),

  selling_price: z
    .number()
    .min(
      1,
      "products.validation.sellingPriceRequired",
    ),

  stock: z
    .number()
    .min(
      0,
      "products.validation.stockMinimum",
    ),

  minimum_stock: z
    .number()
    .min(
      0,
      "products.validation.minimumStockMinimum",
    ),

  is_active: z.boolean(),
});

export type ProductFormData = z.infer<
  typeof productSchema
>;