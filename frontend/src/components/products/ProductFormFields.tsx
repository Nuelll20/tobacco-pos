import { useTranslation } from "react-i18next";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ProductFormData } from "@/schemas/product";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

type ProductFormFieldsProps = {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
};

export default function ProductFormFields({
  register,
  errors,
  watch,
  setValue,
}: ProductFormFieldsProps) {
  const { t } = useTranslation();

  function translateValidationMessage(
    message?: string,
  ): string {
    return message ? t(message) : "";
  }

  const isActive = watch("is_active");

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sku">
            {t("products.form.sku")}
          </Label>

          <Input
            id="sku"
            placeholder={t(
              "products.form.skuPlaceholder",
            )}
            {...register("sku")}
          />

          {errors.sku && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(errors.sku.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">
            {t("products.form.name")}
          </Label>

          <Input
            id="name"
            placeholder={t(
              "products.form.namePlaceholder",
            )}
            {...register("name")}
          />

          {errors.name && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(errors.name.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchase_price">
            {t("products.form.purchasePrice")}
          </Label>

          <Input
            id="purchase_price"
            type="number"
            min="0"
            {...register("purchase_price", {
              valueAsNumber: true,
            })}
          />

          {errors.purchase_price && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(errors.purchase_price.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="selling_price">
            {t("products.form.sellingPrice")}
          </Label>

          <Input
            id="selling_price"
            type="number"
            min="0"
            {...register("selling_price", {
              valueAsNumber: true,
            })}
          />

          {errors.selling_price && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(errors.selling_price.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">
            {t("products.form.stock")}
          </Label>

          <Input
            id="stock"
            type="number"
            min="0"
            {...register("stock", {
              valueAsNumber: true,
            })}
          />

          {errors.stock && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(errors.stock.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimum_stock">
            {t("products.form.minimumStock")}
          </Label>

          <Input
            id="minimum_stock"
            type="number"
            min="0"
            {...register("minimum_stock", {
              valueAsNumber: true,
            })}
          />

          {errors.minimum_stock && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(errors.minimum_stock.message)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Checkbox
          id="is_active"
          checked={isActive}
          onCheckedChange={(checked) =>
            setValue(
              "is_active",
              checked === true,
              {
                shouldDirty: true,
              },
            )
          }
        />

        <Label htmlFor="is_active">
          {t("products.form.active")}
        </Label>
      </div>
    </>
  );
}