import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
};

export default function ProductPagination({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
}: Props) {
  const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  return (
    <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <div>
        Showing {from} to {to} of {total} products
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
  );
}