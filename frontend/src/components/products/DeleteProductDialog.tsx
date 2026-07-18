import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
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

import type { Product } from "@/types/product";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  loading?: boolean;
  onConfirm: () => void;
};

export default function DeleteProductDialog({
  open,
  onOpenChange,
  product,
  loading = false,
  onConfirm,
}: Props) {
  const { t } = useTranslation();

  const productName =
    product?.name ??
    t("products.deleteDialog.fallbackName");

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
            {t("products.deleteDialog.title")}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {t(
              "products.deleteDialog.description",
              {
                name: productName,
              },
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {t(
              "products.deleteDialog.cancel",
            )}
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              type="button"
              variant="destructive"
              disabled={loading || !product}
              onClick={onConfirm}
            >
              {loading && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}

              {t(
                "products.deleteDialog.confirm",
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}