import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

type SupplierErrorStateProps = {
  onRetry: () => void;
};

export default function SupplierErrorState({
  onRetry,
}: SupplierErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center rounded-md border border-dashed">
      <div className="flex max-w-md flex-col items-center gap-4 px-6 py-10 text-center">
        <div className="rounded-full bg-destructive/10 p-3 text-destructive">
          <AlertTriangle className="size-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            {t("suppliers.error.title")}
          </h3>

          <p className="text-sm text-muted-foreground">
            {t(
              "suppliers.error.description",
            )}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
        >
          <RefreshCw className="mr-2 size-4" />

          {t("suppliers.error.retry")}
        </Button>
      </div>
    </div>
  );
}