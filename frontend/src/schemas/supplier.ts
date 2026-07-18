import { z } from "zod";

export const supplierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      1,
      "suppliers.validation.nameRequired",
    )
    .max(
      255,
      "suppliers.validation.nameMaximum",
    ),

  phone: z
    .string()
    .trim()
    .max(
      50,
      "suppliers.validation.phoneMaximum",
    ),

  address: z
    .string()
    .trim(),

  notes: z
    .string()
    .trim(),

  is_active: z.boolean(),
});

export type SupplierFormData = z.infer<
  typeof supplierSchema
>;