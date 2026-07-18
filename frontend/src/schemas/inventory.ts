import { z } from "zod";

export const inventoryMovementSchema = z
  .object({
    product_id: z
      .number({
        message:
          "inventory.validation.productRequired",
      })
      .min(
        1,
        "inventory.validation.productRequired",
      ),

    type: z.enum(
      [
        "stock_in",
        "stock_out",
        "adjustment",
      ],
      {
        message:
          "inventory.validation.movementTypeRequired",
      },
    ),

    quantity: z
      .number({
        message:
          "inventory.validation.quantityRequired",
      })
      .min(
        0,
        "inventory.validation.quantityNegative",
      ),

    reference_no: z
      .string()
      .max(
        255,
        "inventory.validation.referenceTooLong",
      )
      .optional()
      .nullable(),

    note: z
      .string()
      .optional()
      .nullable(),
  })
  .superRefine((data, context) => {
    if (
      (data.type === "stock_in" ||
        data.type === "stock_out") &&
      data.quantity < 1
    ) {
      context.addIssue({
        code: "custom",
        path: ["quantity"],
        message:
          "inventory.validation.quantityAtLeastOne",
      });
    }
  });

export type InventoryMovementFormData =
  z.infer<typeof inventoryMovementSchema>;