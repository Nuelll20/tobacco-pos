import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import {
  useTranslation,
} from "react-i18next";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type {
  PurchaseFormData,
} from "@/schemas/purchase";

type PurchaseNotesFieldProps = {
  register: UseFormRegister<PurchaseFormData>;
  errors: FieldErrors<PurchaseFormData>;
  isSaving: boolean;
};

export default function PurchaseNotesField({
  register,
  errors,
  isSaving,
}: PurchaseNotesFieldProps) {
  const { t } = useTranslation();

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
    <div className="space-y-2">
      <Label htmlFor="notes">
        {t("purchases.form.notes")}
      </Label>

      <Textarea
        id="notes"
        rows={4}
        disabled={isSaving}
        placeholder={t(
          "purchases.form.notesPlaceholder",
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
  );
}