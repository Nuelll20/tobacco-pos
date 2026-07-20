import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useSuppliers } from "@/hooks/useSuppliers";

import type {
  PurchaseFormData,
} from "@/schemas/purchase";

type PurchaseMainFieldsProps = {
  register: UseFormRegister<PurchaseFormData>;
  errors: FieldErrors<PurchaseFormData>;
  isSaving: boolean;
};

export default function PurchaseMainFields({
  register,
  errors,
  isSaving,
}: PurchaseMainFieldsProps) {
  const { t } = useTranslation();

  const {
    data: suppliersData,
    isLoading: isSuppliersLoading,
  } = useSuppliers({
    per_page: 100,
    is_active: true,
  });

  const suppliers =
    suppliersData?.data ?? [];

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
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="purchase_date">
          {t("purchases.form.purchaseDate")}
        </Label>

        <Input
          id="purchase_date"
          type="date"
          disabled={isSaving}
          {...register("purchase_date")}
        />

        {errors.purchase_date && (
          <p className="text-sm text-destructive">
            {translateValidationMessage(
              errors.purchase_date.message,
            )}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier_id">
          {t("purchases.form.supplier")}
        </Label>

        <select
          id="supplier_id"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          disabled={
            isSaving ||
            isSuppliersLoading
          }
          {...register("supplier_id", {
            valueAsNumber: true,
          })}
        >
          <option value={0}>
            {isSuppliersLoading
              ? t(
                  "purchases.form.loadingSuppliers",
                )
              : t(
                  "purchases.form.selectSupplier",
                )}
          </option>

          {suppliers.map((supplier) => (
            <option
              key={supplier.id}
              value={supplier.id}
            >
              {supplier.name}
            </option>
          ))}
        </select>

        {errors.supplier_id && (
          <p className="text-sm text-destructive">
            {translateValidationMessage(
              errors.supplier_id.message,
            )}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="receipt_status">
          {t(
            "purchases.form.receiptStatus",
          )}
        </Label>

        <select
          id="receipt_status"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          disabled={isSaving}
          {...register("receipt_status")}
        >
          <option value="draft">
            {t(
              "purchases.receiptStatuses.draft",
            )}
          </option>

          <option value="ordered">
            {t(
              "purchases.receiptStatuses.ordered",
            )}
          </option>
        </select>

        {errors.receipt_status && (
          <p className="text-sm text-destructive">
            {translateValidationMessage(
              errors.receipt_status.message,
            )}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="paid_amount">
          {t("purchases.form.paidAmount")}
        </Label>

        <Input
          id="paid_amount"
          type="number"
          min={0}
          step="0.01"
          disabled={isSaving}
          {...register("paid_amount", {
            valueAsNumber: true,
          })}
        />

        {errors.paid_amount && (
          <p className="text-sm text-destructive">
            {translateValidationMessage(
              errors.paid_amount.message,
            )}
          </p>
        )}
      </div>
    </div>
  );
}