import {
  useEffect,
} from "react";
import {
  zodResolver,
} from "@hookform/resolvers/zod";
import {
  useForm,
  useWatch,
} from "react-hook-form";
import {
  useTranslation,
} from "react-i18next";
import { toast } from "sonner";

import PurchaseItemsFields from "@/components/purchases/PurchaseItemsFields";
import PurchaseMainFields from "@/components/purchases/PurchaseMainFields";
import PurchaseNotesField from "@/components/purchases/PurchaseNotesField";
import PurchasePaymentSummary from "@/components/purchases/PurchasePaymentSummary";

import { Button } from "@/components/ui/button";

import { useCreatePurchase } from "@/hooks/useCreatePurchase";
import { useUpdatePurchase } from "@/hooks/useUpdatePurchase";

import { getErrorMessage } from "@/lib/error";

import {
  purchaseSchema,
  type PurchaseFormData,
} from "@/schemas/purchase";

import type {
  Purchase,
  PurchasePayload,
} from "@/types/purchase";

type PurchaseFormProps = {
  purchase?: Purchase | null;
  onSuccess?: () => void;
};

function getTodayDate() {
  const now = new Date();

  const timezoneOffset =
    now.getTimezoneOffset() * 60_000;

  return new Date(
    now.getTime() - timezoneOffset,
  )
    .toISOString()
    .slice(0, 10);
}

function getCreateDefaultValues():
  PurchaseFormData {
  return {
    purchase_date: getTodayDate(),
    supplier_id: 0,
    receipt_status: "draft",
    paid_amount: 0,
    notes: "",
    items: [
      {
        product_id: 0,
        quantity: 1,
        unit_cost: 0,
      },
    ],
  };
}

function getPurchaseDefaultValues(
  purchase: Purchase,
): PurchaseFormData {
  return {
    purchase_date:
      purchase.purchase_date,

    supplier_id:
      purchase.supplier_id,

    receipt_status:
      purchase.receipt_status ===
      "ordered"
        ? "ordered"
        : "draft",

    paid_amount:
      Number(
        purchase.paid_amount,
      ) || 0,

    notes:
      purchase.notes ?? "",

    items:
      purchase.items &&
      purchase.items.length > 0
        ? purchase.items.map(
            (item) => ({
              product_id:
                item.product_id ?? 0,

              quantity:
                item.quantity,

              unit_cost:
                Number(
                  item.unit_cost,
                ) || 0,
            }),
          )
        : [
            {
              product_id: 0,
              quantity: 1,
              unit_cost: 0,
            },
          ],
  };
}

export default function PurchaseForm({
  purchase,
  onSuccess,
}: PurchaseFormProps) {
  const { t } = useTranslation();

  const createPurchaseMutation =
    useCreatePurchase();

  const updatePurchaseMutation =
    useUpdatePurchase();

  const isEditing =
    purchase !== undefined &&
    purchase !== null;

  const isSaving =
    createPurchaseMutation.isPending ||
    updatePurchaseMutation.isPending;

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
    },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(
      purchaseSchema,
    ),

    defaultValues: purchase
      ? getPurchaseDefaultValues(
          purchase,
        )
      : getCreateDefaultValues(),
  });

  const watchedItems =
    useWatch({
      control,
      name: "items",
    }) ?? [];

  const totalAmount =
    watchedItems.reduce(
      (total, item) => {
        const quantity =
          Number(item.quantity) || 0;

        const unitCost =
          Number(item.unit_cost) || 0;

        return (
          total +
          quantity * unitCost
        );
      },
      0,
    );

  useEffect(() => {
    reset(
      purchase
        ? getPurchaseDefaultValues(
            purchase,
          )
        : getCreateDefaultValues(),
    );
  }, [
    purchase,
    reset,
  ]);

  function handleMutationSuccess() {
    toast.success(
      t(
        isEditing
          ? "purchases.toast.updated"
          : "purchases.toast.created",
      ),
    );

    if (!isEditing) {
      reset(
        getCreateDefaultValues(),
      );
    }

    onSuccess?.();
  }

  function onSubmit(
    data: PurchaseFormData,
  ) {
    const payload:
      PurchasePayload = {
        purchase_date:
          data.purchase_date,

        supplier_id:
          data.supplier_id,

        receipt_status:
          data.receipt_status,

        paid_amount:
          data.paid_amount,

        notes:
          data.notes?.trim()
            ? data.notes.trim()
            : null,

        items:
          data.items.map(
            (item) => ({
              product_id:
                item.product_id,

              quantity:
                item.quantity,

              unit_cost:
                item.unit_cost,
            }),
          ),
      };

    if (purchase) {
      updatePurchaseMutation.mutate(
        {
          id: purchase.id,
          payload,
        },
        {
          onSuccess:
            handleMutationSuccess,

          onError: (error) => {
            toast.error(
              getErrorMessage(
                error,
              ),
            );
          },
        },
      );

      return;
    }

    createPurchaseMutation.mutate(
      payload,
      {
        onSuccess:
          handleMutationSuccess,

        onError: (error) => {
          toast.error(
            getErrorMessage(
              error,
            ),
          );
        },
      },
    );
  }

  return (
    <form
      onSubmit={
        handleSubmit(onSubmit)
      }
      className="space-y-6"
    >
      <PurchaseMainFields
        register={register}
        errors={errors}
        isSaving={isSaving}
      />

      <PurchaseItemsFields
        control={control}
        register={register}
        setValue={setValue}
        errors={errors}
        isSaving={isSaving}
      />

      <PurchasePaymentSummary
        control={control}
      />

      <PurchaseNotesField
        register={register}
        errors={errors}
        isSaving={isSaving}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={
          isSaving ||
          totalAmount <= 0
        }
      >
        {isSaving
          ? t(
              "purchases.form.saving",
            )
          : t(
              isEditing
                ? "purchases.form.update"
                : "purchases.form.save",
            )}
      </Button>
    </form>
  );
}