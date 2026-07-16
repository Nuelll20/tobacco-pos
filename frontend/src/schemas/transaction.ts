import { z } from "zod";

export const transactionItemSchema = z.object({
  product_id: z
    .number({
      message: "Product is required.",
    })
    .int("Product is invalid.")
    .min(1, "Product is required."),

  quantity: z
    .number({
      message: "Quantity is required.",
    })
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1."),
});

export const transactionSchema = z
  .object({
    payment_method: z.enum(["cash", "qris", "transfer"], {
      message: "Payment method is required.",
    }),

    paid_amount: z
      .number({
        message: "Paid amount is required.",
      })
      .min(0, "Paid amount cannot be negative."),

    note: z
      .string()
      .max(1000, "Note is too long.")
      .optional()
      .nullable(),

    items: z
      .array(transactionItemSchema)
      .min(1, "Add at least one product.")
      .max(100, "A transaction cannot contain more than 100 products."),
  })
  .superRefine((data, ctx) => {
    const productIds = data.items.map((item) => item.product_id);
    const duplicateProductIds = productIds.filter(
      (productId, index) =>
        productIds.indexOf(productId) !== index
    );

    if (duplicateProductIds.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["items"],
        message: "The same product cannot be added more than once.",
      });
    }
  });

export type TransactionFormData = z.infer<
  typeof transactionSchema
>;