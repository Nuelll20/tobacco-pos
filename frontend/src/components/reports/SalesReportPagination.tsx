import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

  function formatNumber(value: number) {
    return new Intl.NumberFormat(
      locale,
    ).format(value);
  }

  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {t("reports.pagination.showing", {
          from: formatNumber(from ?? 0),
          to: formatNumber(to ?? 0),
          total: formatNumber(total),
        })}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {t(
              "reports.pagination.rowsPerPage",
            )}
          </span>

          <select
            value={perPage}
            className="h-9 rounded-md border bg-background px-2 text-sm"
            aria-label={t(
              "reports.pagination.rowsPerPage",
            )}
            onChange={(event) =>
              onPerPageChange(
                Number(event.target.value),
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
            {t("reports.pagination.page", {
              current: formatNumber(currentPage),
              last: formatNumber(lastPage),
            })}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={currentPage <= 1}
            aria-label={t(
              "reports.pagination.previousPage",
            )}
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
            aria-label={t(
              "reports.pagination.nextPage",
            )}
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