import { z } from "zod";

const stockOpnameItemSchema = z.object({
  product_id: z
    .number({
      message:
        "stockOpnames.validation.productRequired",
    })
    .min(
      1,
      "stockOpnames.validation.productRequired",
    ),

  counted_stock: z
    .number({
      message:
        "stockOpnames.validation.countedStockRequired",
    })
    .int(
      "stockOpnames.validation.countedStockInteger",
    )
    .min(
      0,
      "stockOpnames.validation.countedStockNegative",
    ),

  note: z
    .string()
    .optional()
    .nullable(),
});

export const stockOpnameSchema = z
  .object({
    counted_at: z
      .string()
      .min(
        1,
        "stockOpnames.validation.countedAtRequired",
      ),

    note: z
      .string()
      .optional()
      .nullable(),

    items: z
      .array(stockOpnameItemSchema)
      .min(
        1,
        "stockOpnames.validation.itemsRequired",
      ),
  })
  .superRefine((data, context) => {
    const productIndexes = new Map<
      number,
      number[]
    >();

    data.items.forEach((item, index) => {
      if (item.product_id < 1) {
        return;
      }

      const indexes =
        productIndexes.get(item.product_id) ?? [];

      indexes.push(index);

      productIndexes.set(
        item.product_id,
        indexes,
      );
    });

    productIndexes.forEach((indexes) => {
      if (indexes.length < 2) {
        return;
      }

      indexes.forEach((index) => {
        context.addIssue({
          code: "custom",
          path: [
            "items",
            index,
            "product_id",
          ],
          message:
            "stockOpnames.validation.duplicateProduct",
        });
      });
    });
  });

export type StockOpnameFormData =
  z.infer<typeof stockOpnameSchema>;