import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import type {
  Supplier,
} from "@/types/supplier";

type DeactivateSupplierDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  loading?: boolean;
  onConfirm: () => void;
};

export default function DeactivateSupplierDialog({
  open,
  onOpenChange,
  supplier,
  loading = false,
  onConfirm,
}: DeactivateSupplierDialogProps) {
  const { t } = useTranslation();

  const supplierName =
    supplier?.name ??
    t(
      "suppliers.deactivateDialog.fallbackName",
    );

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (loading) {
          return;
        }

        onOpenChange(value);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t(
              "suppliers.deactivateDialog.title",
            )}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {t(
              "suppliers.deactivateDialog.description",
              {
                name: supplierName,
              },
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
          >
            {t(
              "suppliers.deactivateDialog.cancel",
            )}
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              type="button"
              variant="destructive"
              disabled={
                loading || !supplier
              }
              onClick={onConfirm}
            >
              {loading && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}

              {t(
                "suppliers.deactivateDialog.confirm",
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}