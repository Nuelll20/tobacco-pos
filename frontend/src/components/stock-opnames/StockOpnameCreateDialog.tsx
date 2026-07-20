import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import StockOpnameForm from "@/components/stock-opnames/StockOpnameForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateStockOpname } from "@/hooks/useCreateStockOpname";
import { getErrorMessage } from "@/lib/error";

import type {
  StockOpnameFormData,
} from "@/schemas/stock-opname";

interface StockOpnameCreateDialogProps {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
}

export default function StockOpnameCreateDialog({
  open,
  onOpenChange,
}: StockOpnameCreateDialogProps) {
  const { t } = useTranslation();

  const createStockOpnameMutation =
    useCreateStockOpname();

  function handleSubmit(
    data: StockOpnameFormData,
  ) {
    createStockOpnameMutation.mutate(
      {
        counted_at: data.counted_at,
        note: data.note || null,
        items: data.items.map(
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
      {
        onSuccess: () => {
          toast.success(
            t(
              "stockOpnames.toast.created",
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
              "stockOpnames.createDialog.title",
            )}
          </DialogTitle>

          <DialogDescription>
            {t(
              "stockOpnames.createDialog.description",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <StockOpnameForm
            isSaving={
              createStockOpnameMutation.isPending
            }
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}