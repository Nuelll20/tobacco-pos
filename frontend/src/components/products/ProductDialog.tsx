import { useTranslation } from "react-i18next";

import ProductForm from "@/components/products/ProductForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Product } from "@/types/product";

type ProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  product: Product | null;
};

export default function ProductDialog({
  open,
  onOpenChange,
  mode,
  product,
}: ProductDialogProps) {
  const { t } = useTranslation();

  const isCreateMode = mode === "create";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isCreateMode
              ? t("products.dialog.addTitle")
              : t("products.dialog.editTitle")}
          </DialogTitle>

          <DialogDescription>
            {isCreateMode
              ? t(
                  "products.dialog.addDescription",
                )
              : t(
                  "products.dialog.editDescription",
                )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <ProductForm
            product={product}
            onSuccess={() =>
              onOpenChange(false)
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}