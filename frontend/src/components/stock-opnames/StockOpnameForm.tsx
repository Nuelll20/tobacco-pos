import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";
import {
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProducts } from "@/hooks/useProducts";
import {
  stockOpnameSchema,
  type StockOpnameFormData,
} from "@/schemas/stock-opname";

interface StockOpnameFormProps {
  defaultValues?: StockOpnameFormData;
  isSaving?: boolean;
  onSubmit: (
    data: StockOpnameFormData,
  ) => void;
}

const emptyFormValues: StockOpnameFormData = {
  counted_at: "",
  note: "",
  items: [
    {
      product_id: 0,
      counted_stock: 0,
      note: "",
    },
  ],
};

export default function StockOpnameForm({
  defaultValues,
  isSaving = false,
  onSubmit,
}: StockOpnameFormProps) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
    },
  } = useForm<StockOpnameFormData>({
    resolver: zodResolver(
      stockOpnameSchema,
    ),

    defaultValues:
      defaultValues ?? emptyFormValues,
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

  const {
    data: productsData,
    isLoading: isProductsLoading,
  } = useProducts({
    per_page: 50,
    sort_by: "name",
    sort_direction: "asc",
  });

  const products =
    productsData?.data ?? [];

  const watchedItems =
    watch("items");

  useEffect(() => {
    reset(
      defaultValues ?? emptyFormValues,
    );
  }, [
    defaultValues,
    reset,
  ]);

  function formatNumber(
    value: number,
  ) {
    return new Intl.NumberFormat(
      locale,
    ).format(value);
  }

  function translateValidationMessage(
    message?: string,
  ) {
    return message
      ? t(message, {
          defaultValue: message,
        })
      : "";
  }

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="counted_at">
            {t(
              "stockOpnames.form.countedAt",
            )}
          </Label>

          <Input
            id="counted_at"
            type="date"
            disabled={isSaving}
            {...register("counted_at")}
          />

          {errors.counted_at && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(
                errors.counted_at.message,
              )}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="stock-opname-note">
            {t(
              "stockOpnames.form.note",
            )}
          </Label>

          <textarea
            id="stock-opname-note"
            rows={3}
            disabled={isSaving}
            placeholder={t(
              "stockOpnames.form.notePlaceholder",
            )}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            {...register("note")}
          />

          {errors.note && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(
                errors.note.message,
              )}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">
              {t(
                "stockOpnames.form.itemsTitle",
              )}
            </h3>

            <p className="text-sm text-muted-foreground">
              {t(
                "stockOpnames.form.itemsDescription",
              )}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={
              isSaving ||
              isProductsLoading
            }
            onClick={() =>
              append({
                product_id: 0,
                counted_stock: 0,
                note: "",
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />

            {t(
              "stockOpnames.form.addItem",
            )}
          </Button>
        </div>

        {errors.items?.root?.message && (
          <p className="text-sm text-destructive">
            {translateValidationMessage(
              errors.items.root.message,
            )}
          </p>
        )}

        <div className="space-y-4">
          {fields.map(
            (field, index) => {
              const selectedProduct =
                products.find(
                  (product) =>
                    product.id ===
                    watchedItems?.[index]
                      ?.product_id,
                );

              return (
                <div
                  key={field.id}
                  className="rounded-md border p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-medium">
                      {t(
                        "stockOpnames.form.itemNumber",
                        {
                          number:
                            index + 1,
                        },
                      )}
                    </p>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t(
                        "stockOpnames.form.removeItem",
                      )}
                      disabled={
                        isSaving ||
                        fields.length <= 1
                      }
                      onClick={() =>
                        remove(index)
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label
                        htmlFor={`items.${index}.product_id`}
                      >
                        {t(
                          "stockOpnames.form.product",
                        )}
                      </Label>

                      <select
                        id={`items.${index}.product_id`}
                        disabled={
                          isSaving ||
                          isProductsLoading
                        }
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                        {...register(
                          `items.${index}.product_id`,
                          {
                            valueAsNumber:
                              true,
                          },
                        )}
                      >
                        <option value={0}>
                          {isProductsLoading
                            ? t(
                                "stockOpnames.form.loadingProducts",
                              )
                            : t(
                                "stockOpnames.form.selectProduct",
                              )}
                        </option>

                        {products.map(
                          (product) => (
                            <option
                              key={
                                product.id
                              }
                              value={
                                product.id
                              }
                            >
                              {
                                product.name
                              }{" "}
                              - {
                                product.sku
                              }
                            </option>
                          ),
                        )}
                      </select>

                      {errors.items?.[
                        index
                      ]?.product_id && (
                        <p className="text-sm text-destructive">
                          {translateValidationMessage(
                            errors.items[
                              index
                            ]?.product_id
                              ?.message,
                          )}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>
                        {t(
                          "stockOpnames.form.systemStock",
                        )}
                      </Label>

                      <div className="flex h-10 items-center rounded-md border bg-muted px-3 text-sm">
                        {selectedProduct
                          ? formatNumber(
                              selectedProduct.stock,
                            )
                          : "-"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor={`items.${index}.counted_stock`}
                      >
                        {t(
                          "stockOpnames.form.countedStock",
                        )}
                      </Label>

                      <Input
                        id={`items.${index}.counted_stock`}
                        type="number"
                        min={0}
                        disabled={isSaving}
                        {...register(
                          `items.${index}.counted_stock`,
                          {
                            valueAsNumber:
                              true,
                          },
                        )}
                      />

                      {errors.items?.[
                        index
                      ]?.counted_stock && (
                        <p className="text-sm text-destructive">
                          {translateValidationMessage(
                            errors.items[
                              index
                            ]?.counted_stock
                              ?.message,
                          )}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label
                        htmlFor={`items.${index}.note`}
                      >
                        {t(
                          "stockOpnames.form.itemNote",
                        )}
                      </Label>

                      <Input
                        id={`items.${index}.note`}
                        disabled={isSaving}
                        placeholder={t(
                          "stockOpnames.form.itemNotePlaceholder",
                        )}
                        {...register(
                          `items.${index}.note`,
                        )}
                      />

                      {errors.items?.[
                        index
                      ]?.note && (
                        <p className="text-sm text-destructive">
                          {translateValidationMessage(
                            errors.items[
                              index
                            ]?.note
                              ?.message,
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={
          isSaving ||
          isProductsLoading
        }
      >
        {isSaving
          ? t(
              "stockOpnames.form.saving",
            )
          : t(
              "stockOpnames.form.saveDraft",
            )}
      </Button>
    </form>
  );
}