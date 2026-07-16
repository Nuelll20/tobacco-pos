import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type SalesReportPaginationProps = {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  from: number | null;
  to: number | null;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
};

const perPageOptions = [10, 25, 50];

export default function SalesReportPagination({
  currentPage,
  lastPage,
  total,
  perPage,
  from,
  to,
  onPageChange,
  onPerPageChange,
}: SalesReportPaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {from ?? 0} to {to ?? 0} of{" "}
        {total.toLocaleString("id-ID")} transactions
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Rows per page
          </span>

          <select
            value={perPage}
            className="h-9 rounded-md border bg-background px-2 text-sm"
            aria-label="Rows per page"
            onChange={(event) =>
              onPerPageChange(
                Number(event.target.value)
              )
            }
          >
            {perPageOptions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {lastPage}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={currentPage <= 1}
            aria-label="Previous page"
            onClick={() =>
              onPageChange(currentPage - 1)
            }
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={currentPage >= lastPage}
            aria-label="Next page"
            onClick={() =>
              onPageChange(currentPage + 1)
            }
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
