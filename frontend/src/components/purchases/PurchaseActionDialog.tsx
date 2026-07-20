import {
  useTranslation,
} from "react-i18next";
import { toast } from "sonner";

import { useCancelPurchase } from "@/hooks/useCancelPurchase";
import { useReceivePurchase } from "@/hooks/useReceivePurchase";

import { getErrorMessage } from "@/lib/error";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  Purchase,
} from "@/types/purchase";

export type PurchaseAction =
  | "receive"
  | "cancel";

type PurchaseActionDialogProps = {
  open: boolean;
  action: PurchaseAction | null;
  purchase: Purchase | null;
  onOpenChange: (
    open: boolean,
  ) => void;
  onSuccess?: () => void;
};

export default function PurchaseActionDialog({
  open,
  action,
  purchase,
  onOpenChange,
  onSuccess,
}: PurchaseActionDialogProps) {
  const { t } = useTranslation();

  const receivePurchaseMutation =
    useReceivePurchase();

  const cancelPurchaseMutation =
    useCancelPurchase();

  const isReceiving =
    receivePurchaseMutation.isPending;

  const isCancelling =
    cancelPurchaseMutation.isPending;

  const isProcessing =
    isReceiving ||
    isCancelling;

  const isReceiveAction =
    action === "receive";

  function handleSuccess() {
    toast.success(
      t(
        isReceiveAction
          ? "purchases.toast.received"
          : "purchases.toast.cancelled",
      ),
    );

    onOpenChange(false);
    onSuccess?.();
  }

  function handleConfirm() {
    if (
      !purchase ||
      !action ||
      isProcessing
    ) {
      return;
    }

    if (action === "receive") {
      receivePurchaseMutation.mutate(
        purchase.id,
        {
          onSuccess: handleSuccess,

          onError: (error) => {
            toast.error(
              getErrorMessage(error),
            );
          },
        },
      );

      return;
    }

    cancelPurchaseMutation.mutate(
      purchase.id,
      {
        onSuccess: handleSuccess,

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
      onOpenChange={(nextOpen) => {
        if (!isProcessing) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t(
              isReceiveAction
                ? "purchases.actionDialog.receiveTitle"
                : "purchases.actionDialog.cancelTitle",
            )}
          </DialogTitle>

          <DialogDescription>
            {t(
              isReceiveAction
                ? "purchases.actionDialog.receiveDescription"
                : "purchases.actionDialog.cancelDescription",
              {
                number:
                  purchase?.purchase_no ??
                  "-",
              },
            )}
          </DialogDescription>
        </DialogHeader>

        {isReceiveAction && (
          <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
            {t(
              "purchases.actionDialog.receiveWarning",
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isProcessing}
            onClick={() =>
              onOpenChange(false)
            }
          >
            {t(
              "purchases.actionDialog.back",
            )}
          </Button>

          <Button
            type="button"
            variant={
              isReceiveAction
                ? "default"
                : "destructive"
            }
            disabled={
              isProcessing ||
              !purchase ||
              !action
            }
            onClick={handleConfirm}
          >
            {isProcessing
              ? t(
                  "purchases.actionDialog.processing",
                )
              : t(
                  isReceiveAction
                    ? "purchases.actionDialog.confirmReceive"
                    : "purchases.actionDialog.confirmCancel",
                )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}