import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import SupplierFormFields from "@/components/suppliers/SupplierFormFields";
import { Button } from "@/components/ui/button";
import { useCreateSupplier } from "@/hooks/useCreateSupplier";
import { useUpdateSupplier } from "@/hooks/useUpdateSupplier";
import { getErrorMessage } from "@/lib/error";
import {
  supplierSchema,
  type SupplierFormData,
} from "@/schemas/supplier";

import type {
  Supplier,
  SupplierPayload,
} from "@/types/supplier";

type SupplierFormProps = {
  supplier?: Supplier | null;
  onSuccess?: () => void;
};

const defaultValues: SupplierFormData = {
  name: "",
  phone: "",
  address: "",
  notes: "",
  is_active: true,
};

export default function SupplierForm({
  supplier,
  onSuccess,
}: SupplierFormProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues,
  });

  const createSupplierMutation =
    useCreateSupplier();

  const updateSupplierMutation =
    useUpdateSupplier();

  useEffect(() => {
    if (supplier) {
      reset({
        name: supplier.name,
        phone: supplier.phone ?? "",
        address: supplier.address ?? "",
        notes: supplier.notes ?? "",
        is_active: supplier.is_active,
      });

      return;
    }

    reset(defaultValues);
  }, [supplier, reset]);

  const isSaving =
    createSupplierMutation.isPending ||
    updateSupplierMutation.isPending;

  function nullableValue(
    value: string,
  ): string | null {
    const trimmedValue = value.trim();

    return trimmedValue.length > 0
      ? trimmedValue
      : null;
  }

  function onSubmit(data: SupplierFormData) {
    const payload: SupplierPayload = {
      name: data.name.trim(),
      phone: nullableValue(data.phone),
      address: nullableValue(data.address),
      notes: nullableValue(data.notes),
      is_active: data.is_active,
    };

    if (supplier) {
      updateSupplierMutation.mutate(
        {
          id: supplier.id,
          payload,
        },
        {
          onSuccess: () => {
            toast.success(
              t("suppliers.toast.updated"),
            );

            reset(defaultValues);
            onSuccess?.();
          },

          onError: (error) => {
            toast.error(
              getErrorMessage(error),
            );
          },
        },
      );

      return;
    }

    createSupplierMutation.mutate(
      payload,
      {
        onSuccess: () => {
          toast.success(
            t("suppliers.toast.created"),
          );

          reset(defaultValues);
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
      <SupplierFormFields
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isSaving}
      >
        {isSaving
          ? t("suppliers.form.saving")
          : t("suppliers.form.save")}
      </Button>
    </form>
  );
}