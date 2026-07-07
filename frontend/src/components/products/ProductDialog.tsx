import ProductForm from "@/components/products/ProductForm";
import type { Product } from "@/types/product";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Add Product"
              : "Edit Product"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Fill in the information below to create a new product."
              : "Update the information of this product."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <ProductForm
            product={product}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}