import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateInventoryMovement } from "@/hooks/useCreateInventoryMovement";
import { useProducts } from "@/hooks/useProducts";
import { getErrorMessage } from "@/lib/error";
import {
  inventoryMovementSchema,
  type InventoryMovementFormData,
} from "@/schemas/inventory";

type InventoryMovementFormProps = {
  onSuccess?: () => void;
};

export default function InventoryMovementForm({
  onSuccess,
}: InventoryMovementFormProps) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InventoryMovementFormData>({
    resolver: zodResolver(
      inventoryMovementSchema,
    ),

    defaultValues: {
      product_id: 0,
      type: "stock_in",
      quantity: 1,
      reference_no: "",
      note: "",
    },
  });

  const {
    data: productsData,
    isLoading: isProductsLoading,
  } = useProducts({
    per_page: 50,
    sort_by: "name",
    sort_direction: "asc",
  });

  const createInventoryMovementMutation =
    useCreateInventoryMovement();

  const isSaving =
    createInventoryMovementMutation.isPending;

  function formatNumber(value: number) {
    return new Intl.NumberFormat(
      locale,
    ).format(value);
  }

  function translateValidationMessage(
    message?: string,
  ): string {
    return message
      ? t(message, {
          defaultValue: message,
        })
      : "";
  }

  function onSubmit(
    data: InventoryMovementFormData,
  ) {
    createInventoryMovementMutation.mutate(
      {
        product_id: data.product_id,
        type: data.type,
        quantity: data.quantity,
        reference_no:
          data.reference_no || null,
        note: data.note || null,
      },
      {
        onSuccess: () => {
          toast.success(
            t("inventory.toast.created"),
          );

          reset({
            product_id: 0,
            type: "stock_in",
            quantity: 1,
            reference_no: "",
            note: "",
          });

          onSuccess?.();
        },

        onError: (error) => {
          toast.error(
            getErrorMessage(error),
          );
        },
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="product_id">
            {t("inventory.form.product")}
          </Label>

          <select
            id="product_id"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            disabled={
              isProductsLoading ||
              isSaving
            }
            {...register("product_id", {
              valueAsNumber: true,
            })}
          >
            <option value={0}>
              {isProductsLoading
                ? t(
                    "inventory.form.loadingProducts",
                  )
                : t(
                    "inventory.form.selectProduct",
                  )}
            </option>

            {(productsData?.data ?? []).map(
              (product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {t(
                    "inventory.form.productOption",
                    {
                      name: product.name,
                      sku: product.sku,
                      stock: formatNumber(
                        product.stock,
                      ),
                    },
                  )}
                </option>
              ),
            )}
          </select>

          {errors.product_id && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(errors.product_id.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">
            {t(
              "inventory.form.movementType",
            )}
          </Label>

          <select
            id="type"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            disabled={isSaving}
            {...register("type")}
          >
            <option value="stock_in">
              {t(
                "inventory.movementTypes.stockIn",
              )}
            </option>

            <option value="stock_out">
              {t(
                "inventory.movementTypes.stockOut",
              )}
            </option>

            <option value="adjustment">
              {t(
                "inventory.movementTypes.adjustment",
              )}
            </option>
          </select>

          {errors.type && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(errors.type.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">
            {t("inventory.form.quantity")}
          </Label>

          <Input
            id="quantity"
            type="number"
            min={0}
            disabled={isSaving}
            {...register("quantity", {
              valueAsNumber: true,
            })}
          />

          {errors.quantity && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(errors.quantity.message)}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="reference_no">
            {t(
              "inventory.form.referenceNo",
            )}
          </Label>

          <Input
            id="reference_no"
            placeholder={t(
              "inventory.form.referencePlaceholder",
            )}
            disabled={isSaving}
            {...register("reference_no")}
          />

          {errors.reference_no && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(errors.reference_no.message)}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="note">
            {t("inventory.form.note")}
          </Label>

          <textarea
            id="note"
            rows={4}
            placeholder={t(
              "inventory.form.notePlaceholder",
            )}
            disabled={isSaving}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            {...register("note")}
          />

          {errors.note && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(errors.note.message)}
            </p>
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
          ? t("inventory.form.saving")
          : t("inventory.form.save")}
      </Button>
    </form>
  );
}