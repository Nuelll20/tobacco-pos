import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

type TransactionErrorStateProps = {
  onRetry: () => void;
};

export default function TransactionErrorState({
  onRetry,
}: TransactionErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center rounded-md border border-dashed p-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <AlertCircle className="mb-4 size-10 text-destructive" />

        <h2 className="text-lg font-semibold">
          {t("transactions.error.title")}
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {t("transactions.error.description")}
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={onRetry}
        >
          {t("transactions.error.retry")}
        </Button>
      </div>
    </div>
  );
}