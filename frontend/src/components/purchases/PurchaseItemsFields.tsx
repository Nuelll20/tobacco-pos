import {
  Plus,
  Trash2,
} from "lucide-react";
import {
  useFieldArray,
  useWatch,
} from "react-hook-form";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import {
  useTranslation,
} from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useProducts } from "@/hooks/useProducts";

import type {
  PurchaseFormData,
} from "@/schemas/purchase";

type PurchaseItemsFieldsProps = {
  control: Control<PurchaseFormData>;
  register: UseFormRegister<PurchaseFormData>;
  setValue: UseFormSetValue<PurchaseFormData>;
  errors: FieldErrors<PurchaseFormData>;
  isSaving: boolean;
};

export default function PurchaseItemsFields({
  control,
  register,
  setValue,
  errors,
  isSaving,
}: PurchaseItemsFieldsProps) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

  const {
    data: productsData,
    isLoading: isProductsLoading,
  } = useProducts({
    per_page: 100,
    sort_by: "name",
    sort_direction: "asc",
  });

  const products = (
    productsData?.data ?? []
  ).filter((product) => product.is_active);

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems =
    useWatch({
      control,
      name: "items",
    }) ?? [];

  function formatCurrency(value: number) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatNumber(value: number) {
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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">
            {t("purchases.form.itemsTitle")}
          </h3>

          <p className="text-sm text-muted-foreground">
            {t(
              "purchases.form.itemsDescription",
            )}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={
            isSaving ||
            isProductsLoading
          }
          onClick={() =>
            append({
              product_id: 0,
              quantity: 1,
              unit_cost: 0,
            })
          }
        >
          <Plus className="mr-2 size-4" />

          {t("purchases.form.addItem")}
        </Button>
      </div>

      {fields.map((field, index) => {
        const watchedItem =
          watchedItems[index];

        const quantity =
          Number(
            watchedItem?.quantity,
          ) || 0;

        const unitCost =
          Number(
            watchedItem?.unit_cost,
          ) || 0;

        const subtotal =
          quantity * unitCost;

        const productRegistration =
          register(
            `items.${index}.product_id`,
            {
              valueAsNumber: true,
            },
          );

        return (
          <div
            key={field.id}
            className="grid gap-4 rounded-lg border p-4 sm:grid-cols-[minmax(220px,1fr)_120px_180px_180px_auto]"
          >
            <div className="space-y-2">
              <Label
                htmlFor={`items.${index}.product_id`}
              >
                {t("purchases.form.product")}
              </Label>

              <select
                id={`items.${index}.product_id`}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                disabled={
                  isSaving ||
                  isProductsLoading
                }
                {...productRegistration}
                onChange={(event) => {
                  productRegistration.onChange(
                    event,
                  );

                  const productId =
                    Number(
                      event.target.value,
                    );

                  const product =
                    products.find(
                      (currentProduct) =>
                        currentProduct.id ===
                        productId,
                    );

                  setValue(
                    `items.${index}.unit_cost`,
                    Number(
                      product?.purchase_price ??
                        0,
                    ),
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                }}
              >
                <option value={0}>
                  {isProductsLoading
                    ? t(
                        "purchases.form.loadingProducts",
                      )
                    : t(
                        "purchases.form.selectProduct",
                      )}
                </option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {t(
                      "purchases.form.productOption",
                      {
                        name: product.name,
                        sku: product.sku,
                      },
                    )}
                  </option>
                ))}
              </select>

              {errors.items?.[index]
                ?.product_id && (
                <p className="text-sm text-destructive">
                  {translateValidationMessage(
                    errors.items[index]
                      ?.product_id
                      ?.message,
                  )}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`items.${index}.quantity`}
              >
                {t("purchases.form.quantity")}
              </Label>

              <Input
                id={`items.${index}.quantity`}
                type="number"
                min={1}
                step={1}
                disabled={isSaving}
                {...register(
                  `items.${index}.quantity`,
                  {
                    valueAsNumber: true,
                  },
                )}
              />

              {errors.items?.[index]
                ?.quantity && (
                <p className="text-sm text-destructive">
                  {translateValidationMessage(
                    errors.items[index]
                      ?.quantity
                      ?.message,
                  )}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`items.${index}.unit_cost`}
              >
                {t("purchases.form.unitCost")}
              </Label>

              <Input
                id={`items.${index}.unit_cost`}
                type="number"
                min={0}
                step="0.01"
                disabled={isSaving}
                {...register(
                  `items.${index}.unit_cost`,
                  {
                    valueAsNumber: true,
                  },
                )}
              />

              {errors.items?.[index]
                ?.unit_cost && (
                <p className="text-sm text-destructive">
                  {translateValidationMessage(
                    errors.items[index]
                      ?.unit_cost
                      ?.message,
                  )}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                {t("purchases.form.subtotal")}
              </Label>

              <div className="flex h-10 items-center justify-end rounded-md border bg-muted/40 px-3 text-sm font-medium">
                {formatCurrency(subtotal)}
              </div>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={
                  fields.length === 1 ||
                  isSaving
                }
                aria-label={t(
                  "purchases.form.removeItemAria",
                  {
                    number:
                      formatNumber(
                        index + 1,
                      ),
                  },
                )}
                onClick={() =>
                  remove(index)
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        );
      })}

      {typeof errors.items?.message ===
        "string" && (
        <p className="text-sm text-destructive">
          {translateValidationMessage(
            errors.items.message,
          )}
        </p>
      )}
    </div>
  );
}