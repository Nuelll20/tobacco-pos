import {
  useTranslation,
} from "react-i18next";

import PurchaseForm from "@/components/purchases/PurchaseForm";

import { usePurchase } from "@/hooks/usePurchase";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

type PurchaseDialogProps = {
  open: boolean;
  purchaseId?: number | null;
  onOpenChange: (
    open: boolean,
  ) => void;
};

export default function PurchaseDialog({
  open,
  purchaseId,
  onOpenChange,
}: PurchaseDialogProps) {
  const { t } = useTranslation();

  const isEditing =
    purchaseId !== undefined &&
    purchaseId !== null;

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = usePurchase(
    purchaseId ?? null,
    open && isEditing,
  );

  const purchase = data?.data;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            {t(
              isEditing
                ? "purchases.dialog.editTitle"
                : "purchases.dialog.addTitle",
            )}
          </DialogTitle>

          <DialogDescription>
            {t(
              isEditing
                ? "purchases.dialog.editDescription"
                : "purchases.dialog.addDescription",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {!isEditing ? (
            <PurchaseForm
              onSuccess={() =>
                onOpenChange(false)
              }
            />
          ) : isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-52 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-10 rounded-md" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center rounded-md border border-dashed p-8 text-center">
              <p className="font-medium">
                {t(
                  "purchases.detail.errorTitle",
                )}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {t(
                  "purchases.detail.errorDescription",
                )}
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  void refetch();
                }}
              >
                {t(
                  "purchases.detail.retry",
                )}
              </Button>
            </div>
          ) : purchase ? (
            <PurchaseForm
              purchase={purchase}
              onSuccess={() =>
                onOpenChange(false)
              }
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}