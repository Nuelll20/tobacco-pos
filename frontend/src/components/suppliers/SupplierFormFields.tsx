import { useTranslation } from "react-i18next";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type {
  SupplierFormData,
} from "@/schemas/supplier";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

type SupplierFormFieldsProps = {
  register: UseFormRegister<SupplierFormData>;
  errors: FieldErrors<SupplierFormData>;
  watch: UseFormWatch<SupplierFormData>;
  setValue: UseFormSetValue<SupplierFormData>;
};

export default function SupplierFormFields({
  register,
  errors,
  watch,
  setValue,
}: SupplierFormFieldsProps) {
  const { t } = useTranslation();

  const isActive = watch("is_active");

  function translateValidationMessage(
    message?: string,
  ): string {
    return message
      ? t(message)
      : "";
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="supplier-name">
            {t("suppliers.form.name")}
          </Label>

          <Input
            id="supplier-name"
            placeholder={t(
              "suppliers.form.namePlaceholder",
            )}
            {...register("name")}
          />

          {errors.name && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(
                errors.name.message,
              )}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="supplier-phone">
            {t("suppliers.form.phone")}
          </Label>

          <Input
            id="supplier-phone"
            type="tel"
            placeholder={t(
              "suppliers.form.phonePlaceholder",
            )}
            {...register("phone")}
          />

          {errors.phone && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(
                errors.phone.message,
              )}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="supplier-address">
            {t("suppliers.form.address")}
          </Label>

          <Textarea
            id="supplier-address"
            rows={3}
            placeholder={t(
              "suppliers.form.addressPlaceholder",
            )}
            {...register("address")}
          />

          {errors.address && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(
                errors.address.message,
              )}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="supplier-notes">
            {t("suppliers.form.notes")}
          </Label>

          <Textarea
            id="supplier-notes"
            rows={3}
            placeholder={t(
              "suppliers.form.notesPlaceholder",
            )}
            {...register("notes")}
          />

          {errors.notes && (
            <p className="text-sm text-destructive">
              {translateValidationMessage(
                errors.notes.message,
              )}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Checkbox
          id="supplier-is-active"
          checked={isActive}
          onCheckedChange={(checked) => {
            setValue(
              "is_active",
              checked === true,
              {
                shouldDirty: true,
              },
            );
          }}
        />

        <Label htmlFor="supplier-is-active">
          {t("suppliers.form.active")}
        </Label>
      </div>
    </>
  );
}