import {
  AlertCircle,
} from "lucide-react";
import {
  useTranslation,
} from "react-i18next";

import {
  Button,
} from "@/components/ui/button";

type PurchaseErrorStateProps = {
  onRetry: () => void;
};

export default function PurchaseErrorState({
  onRetry,
}: PurchaseErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center rounded-md border border-dashed p-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <AlertCircle className="mb-4 size-10 text-destructive" />

        <h2 className="text-lg font-semibold">
          {t("purchases.error.title")}
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {t(
            "purchases.error.description",
          )}
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={onRetry}
        >
          {t("purchases.error.retry")}
        </Button>
      </div>
    </div>
  );
}