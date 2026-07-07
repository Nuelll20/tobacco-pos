import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
};

const perPageOptions = [10, 25, 50];

export default function ProductPagination({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  onPerPageChange,
}: Props) {
  const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  return (
    <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
      <div>
        Showing {from} to {to} of {total} products
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>

          <select
            value={perPage}
            onChange={(event) => {
              onPerPageChange(Number(event.target.value));
            }}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>

          <span className="min-w-20 text-center">
            Page {currentPage} of {lastPage}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= lastPage}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}