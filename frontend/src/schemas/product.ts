import { z } from "zod";

export const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Product name is required"),
  purchase_price: z.number().min(1, "Purchase price is required"),
  selling_price: z.number().min(1, "Selling price is required"),
  stock: z.number().min(0),
  minimum_stock: z.number().min(0),
  is_active: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;