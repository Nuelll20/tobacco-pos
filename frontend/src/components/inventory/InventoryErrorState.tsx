import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

type InventoryErrorStateProps = {
  onRetry: () => void;
};

export default function InventoryErrorState({
  onRetry,
}: InventoryErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-md border border-dashed px-6 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-destructive" />

      <h3 className="text-lg font-semibold">
        {t("inventory.error.title")}
      </h3>

      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {t("inventory.error.description")}
      </p>

      <Button
        type="button"
        variant="outline"
        className="mt-4"
        onClick={onRetry}
      >
        {t("inventory.error.retry")}
      </Button>
    </div>
  );
}