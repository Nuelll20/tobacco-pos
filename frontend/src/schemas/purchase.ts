import { z } from "zod";

export const purchaseItemSchema = z.object({
  product_id: z
    .number({
      message:
        "purchases.validation.productRequired",
    })
    .int(
      "purchases.validation.productInvalid",
    )
    .min(
      1,
      "purchases.validation.productRequired",
    ),

  quantity: z
    .number({
      message:
        "purchases.validation.quantityRequired",
    })
    .int(
      "purchases.validation.quantityWholeNumber",
    )
    .min(
      1,
      "purchases.validation.quantityMinimum",
    ),

  unit_cost: z
    .number({
      message:
        "purchases.validation.unitCostRequired",
    })
    .min(
      0,
      "purchases.validation.unitCostNegative",
    ),
});

export const purchaseSchema = z
  .object({
    purchase_date: z
      .string()
      .min(
        1,
        "purchases.validation.purchaseDateRequired",
      ),

    supplier_id: z
      .number({
        message:
          "purchases.validation.supplierRequired",
      })
      .int(
        "purchases.validation.supplierInvalid",
      )
      .min(
        1,
        "purchases.validation.supplierRequired",
      ),

    receipt_status: z.enum(
      ["draft", "ordered"],
      {
        message:
          "purchases.validation.receiptStatusRequired",
      },
    ),

    paid_amount: z
      .number({
        message:
          "purchases.validation.paidAmountRequired",
      })
      .min(
        0,
        "purchases.validation.paidAmountNegative",
      ),

    notes: z
      .string()
      .max(
        1000,
        "purchases.validation.notesTooLong",
      )
      .optional()
      .nullable(),

    items: z
      .array(purchaseItemSchema)
      .min(
        1,
        "purchases.validation.atLeastOneProduct",
      )
      .max(
        100,
        "purchases.validation.tooManyProducts",
      ),
  })
  .superRefine((data, context) => {
    const productIds = data.items.map(
      (item) => item.product_id,
    );

    const hasDuplicateProduct =
      productIds.some(
        (productId, index) =>
          productIds.indexOf(productId) !==
          index,
      );

    if (hasDuplicateProduct) {
      context.addIssue({
        code: "custom",
        path: ["items"],
        message:
          "purchases.validation.duplicateProduct",
      });
    }

    const totalAmount = data.items.reduce(
      (total, item) =>
        total +
        item.quantity *
          item.unit_cost,
      0,
    );

    if (data.paid_amount > totalAmount) {
      context.addIssue({
        code: "custom",
        path: ["paid_amount"],
        message:
          "purchases.validation.paidAmountExceeded",
      });
    }
  });

export type PurchaseFormData =
  z.infer<typeof purchaseSchema>;