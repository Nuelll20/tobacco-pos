import { useTranslation } from "react-i18next";

import SupplierForm from "@/components/suppliers/SupplierForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  Supplier,
} from "@/types/supplier";

type SupplierDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  supplier: Supplier | null;
};

export default function SupplierDialog({
  open,
  onOpenChange,
  mode,
  supplier,
}: SupplierDialogProps) {
  const { t } = useTranslation();

  const isCreateMode =
    mode === "create";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isCreateMode
              ? t(
                  "suppliers.dialog.addTitle",
                )
              : t(
                  "suppliers.dialog.editTitle",
                )}
          </DialogTitle>

          <DialogDescription>
            {isCreateMode
              ? t(
                  "suppliers.dialog.addDescription",
                )
              : t(
                  "suppliers.dialog.editDescription",
                )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <SupplierForm
            supplier={supplier}
            onSuccess={() => {
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}