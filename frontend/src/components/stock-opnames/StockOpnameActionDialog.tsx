import {
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  StockOpname,
} from "@/types/stock-opname";

type StockOpnameAction =
  | "finalize"
  | "cancel";

interface StockOpnameActionDialogProps {
  action: StockOpnameAction;
  stockOpname: StockOpname | null;
  open: boolean;
  isPending?: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
  onConfirm: () => void;
}

export default function StockOpnameActionDialog({
  action,
  stockOpname,
  open,
  isPending = false,
  onOpenChange,
  onConfirm,
}: StockOpnameActionDialogProps) {
  const { t } = useTranslation();

  const isFinalize =
    action === "finalize";

  const titleKey = isFinalize
    ? "stockOpnames.finalizeDialog.title"
    : "stockOpnames.cancelDialog.title";

  const descriptionKey = isFinalize
    ? "stockOpnames.finalizeDialog.description"
    : "stockOpnames.cancelDialog.description";

  const confirmKey = isPending
    ? isFinalize
      ? "stockOpnames.finalizeDialog.finalizing"
      : "stockOpnames.cancelDialog.cancelling"
    : isFinalize
      ? "stockOpnames.finalizeDialog.confirm"
      : "stockOpnames.cancelDialog.confirm";

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
            {isFinalize ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            ) : (
              <XCircle className="h-6 w-6 text-destructive" />
            )}
          </div>

          <DialogTitle>
            {t(titleKey)}
          </DialogTitle>

          <DialogDescription>
            {t(descriptionKey, {
              opnameNo:
                stockOpname?.opname_no ??
                "-",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 rounded-md border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">
            {t(
              "stockOpnames.actionDialog.opnameNo",
            )}
          </p>

          <p className="mt-1 font-semibold">
            {stockOpname?.opname_no ??
              "-"}
          </p>

          {isFinalize && (
            <p className="mt-3 text-sm text-muted-foreground">
              {t(
                "stockOpnames.finalizeDialog.warning",
              )}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() =>
              onOpenChange(false)
            }
          >
            {t(
              "stockOpnames.actionDialog.close",
            )}
          </Button>

          <Button
            type="button"
            variant={
              isFinalize
                ? "default"
                : "destructive"
            }
            disabled={
              isPending ||
              stockOpname === null
            }
            onClick={onConfirm}
          >
            {isFinalize ? (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            ) : (
              <XCircle className="mr-2 h-4 w-4" />
            )}

            {t(confirmKey)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}