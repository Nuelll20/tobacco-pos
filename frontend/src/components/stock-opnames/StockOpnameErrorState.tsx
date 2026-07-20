import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

interface StockOpnameErrorStateProps {
  onRetry: () => void;
}

export default function StockOpnameErrorState({
  onRetry,
}: StockOpnameErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-md border border-dashed px-6 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-destructive" />

      <h3 className="text-lg font-semibold">
        {t(
          "stockOpnames.error.title",
        )}
      </h3>

      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {t(
          "stockOpnames.error.description",
        )}
      </p>

      <Button
        type="button"
        variant="outline"
        className="mt-4"
        onClick={onRetry}
      >
        {t(
          "stockOpnames.actions.retry",
        )}
      </Button>
    </div>
  );
}