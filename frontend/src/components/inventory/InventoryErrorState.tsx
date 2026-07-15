import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface InventoryErrorStateProps {
  onRetry: () => void;
}

export default function InventoryErrorState({
  onRetry,
}: InventoryErrorStateProps) {
  return (
    <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center rounded-md border border-dashed p-6 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-muted-foreground" />

      <h3 className="text-lg font-semibold">
        Failed to load inventory movements
      </h3>

      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Something went wrong while loading inventory history. Please try again.
      </p>

      <Button
        type="button"
        variant="outline"
        className="mt-4"
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
}