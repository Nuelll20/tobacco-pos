import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type TransactionErrorStateProps = {
  onRetry: () => void;
};

export default function TransactionErrorState({
  onRetry,
}: TransactionErrorStateProps) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center rounded-md border border-dashed p-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <AlertCircle className="mb-4 size-10 text-destructive" />

        <h2 className="text-lg font-semibold">
          Failed to load transactions
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The transaction history could not be loaded. Please try again.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={onRetry}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}