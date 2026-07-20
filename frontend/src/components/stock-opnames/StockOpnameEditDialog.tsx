import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import StockOpnameForm from "@/components/stock-opnames/StockOpnameForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStockOpname } from "@/hooks/useStockOpname";
import { useUpdateStockOpname } from "@/hooks/useUpdateStockOpname";
import { getErrorMessage } from "@/lib/error";

import type {
  StockOpnameFormData,
} from "@/schemas/stock-opname";

interface StockOpnameEditDialogProps {
  stockOpnameId: number | null;
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
}

export default function StockOpnameEditDialog({
  stockOpnameId,
  open,
  onOpenChange,
}: StockOpnameEditDialogProps) {
  const { t } = useTranslation();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useStockOpname(
    open
      ? stockOpnameId
      : null,
  );

  const updateStockOpnameMutation =
    useUpdateStockOpname();

  const stockOpname =
    data?.data;

  const defaultValues =
    useMemo<StockOpnameFormData | undefined>(
      () => {
        if (!stockOpname) {
          return undefined;
        }

        return {
          counted_at:
            stockOpname.counted_at,
          note:
            stockOpname.note ?? "",
          items:
            stockOpname.items?.map(
              (item) => ({
                product_id:
                  item.product_id ?? 0,
                counted_stock:
                  item.counted_stock,
                note:
                  item.note ?? "",
              }),
            ) ?? [],
        };
      },
      [stockOpname],
    );

  function handleSubmit(
    formData: StockOpnameFormData,
  ) {
    if (stockOpnameId === null) {
      return;
    }

    updateStockOpnameMutation.mutate(
      {
        id: stockOpnameId,
        payload: {
          counted_at:
            formData.counted_at,
          note:
            formData.note || null,
          items:
            formData.items.map(
              (item) => ({
                product_id:
                  item.product_id,
                counted_stock:
                  item.counted_stock,
                note:
                  item.note || null,
              }),
            ),
        },
      },
      {
        onSuccess: () => {
          toast.success(
            t(
              "stockOpnames.toast.updated",
            ),
          );

          onOpenChange(false);
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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {t(
              "stockOpnames.editDialog.title",
            )}
          </DialogTitle>

          <DialogDescription>
            {t(
              "stockOpnames.editDialog.description",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
              {t(
                "stockOpnames.editDialog.loading",
              )}
            </div>
          ) : isError ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-destructive">
                {t(
                  "stockOpnames.editDialog.loadError",
                )}
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void refetch();
                }}
              >
                {t(
                  "stockOpnames.actions.retry",
                )}
              </Button>
            </div>
          ) : stockOpname?.status !==
            "draft" ? (
            <div className="flex min-h-48 items-center justify-center text-center text-sm text-muted-foreground">
              {t(
                "stockOpnames.editDialog.notEditable",
              )}
            </div>
          ) : defaultValues ? (
            <StockOpnameForm
              defaultValues={
                defaultValues
              }
              isSaving={
                updateStockOpnameMutation.isPending
              }
              onSubmit={handleSubmit}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}