import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  onRetry: () => void;
};

export default function ProductErrorState({ onRetry }: Props) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center rounded-md border border-dashed">
      <div className="flex max-w-md flex-col items-center gap-4 px-6 py-10 text-center">
        <div className="rounded-full bg-destructive/10 p-3 text-destructive">
          <AlertTriangle className="size-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            Failed to load products
          </h3>

          <p className="text-sm text-muted-foreground">
            Please check your connection or try again.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
        >
          <RefreshCw className="mr-2 size-4" />
          Retry
        </Button>
      </div>
    </div>
  );
}