import { z } from "zod";

export const transactionItemSchema = z.object({
  product_id: z
    .number({
      message:
        "transactions.validation.productRequired",
    })
    .int(
      "transactions.validation.productInvalid",
    )
    .min(
      1,
      "transactions.validation.productRequired",
    ),

  quantity: z
    .number({
      message:
        "transactions.validation.quantityRequired",
    })
    .int(
      "transactions.validation.quantityWholeNumber",
    )
    .min(
      1,
      "transactions.validation.quantityMinimum",
    ),
});

export const transactionSchema = z
  .object({
    payment_method: z.enum(
      ["cash", "qris", "transfer"],
      {
        message:
          "transactions.validation.paymentMethodRequired",
      },
    ),

    paid_amount: z
      .number({
        message:
          "transactions.validation.paidAmountRequired",
      })
      .min(
        0,
        "transactions.validation.paidAmountNegative",
      ),

    note: z
      .string()
      .max(
        1000,
        "transactions.validation.noteTooLong",
      )
      .optional()
      .nullable(),

    items: z
      .array(transactionItemSchema)
      .min(
        1,
        "transactions.validation.atLeastOneProduct",
      )
      .max(
        100,
        "transactions.validation.tooManyProducts",
      ),
  })
  .superRefine((data, context) => {
    const productIds = data.items.map(
      (item) => item.product_id,
    );

    const duplicateProductIds =
      productIds.filter(
        (productId, index) =>
          productIds.indexOf(productId) !==
          index,
      );

    if (duplicateProductIds.length > 0) {
      context.addIssue({
        code: "custom",
        path: ["items"],
        message:
          "transactions.validation.duplicateProduct",
      });
    }
  });

export type TransactionFormData =
  z.infer<typeof transactionSchema>;