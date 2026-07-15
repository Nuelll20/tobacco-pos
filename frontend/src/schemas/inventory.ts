import { z } from "zod";

export const inventoryMovementSchema = z
  .object({
    product_id: z
      .number({
        message: "Product is required.",
      })
      .min(1, "Product is required."),

    type: z.enum(["stock_in", "stock_out", "adjustment"], {
      message: "Movement type is required.",
    }),

    quantity: z
      .number({
        message: "Quantity is required.",
      })
      .min(0, "Quantity cannot be negative."),

    reference_no: z
      .string()
      .max(255, "Reference number is too long.")
      .optional()
      .nullable(),

    note: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.type === "stock_in" || data.type === "stock_out") &&
      data.quantity < 1
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "Quantity must be at least 1 for stock in and stock out.",
      });
    }
  });

export type InventoryMovementFormData = z.infer<
  typeof inventoryMovementSchema
>;