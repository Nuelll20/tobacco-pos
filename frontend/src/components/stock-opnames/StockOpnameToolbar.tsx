import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { StockOpnameStatus } from "@/types/stock-opname";

interface StockOpnameToolbarProps {
  search: string;
  status: StockOpnameStatus | "all";
  dateFrom: string;
  dateTo: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: StockOpnameStatus | "all",
  ) => void;
  onDateFromChange: (
    value: string,
  ) => void;
  onDateToChange: (
    value: string,
  ) => void;
  onResetFilters: () => void;
  onCreate: () => void;
}

export default function StockOpnameToolbar({
  search,
  status,
  dateFrom,
  dateTo,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
  onResetFilters,
  onCreate,
}: StockOpnameToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("stockOpnames.title")}
          </h1>

          <p className="text-sm text-muted-foreground">
            {t("stockOpnames.description")}
          </p>
        </div>

        <Button
          type="button"
          onClick={onCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("stockOpnames.toolbar.create")}
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <div className="space-y-1 lg:col-span-4">
          <label
            htmlFor="stock-opname-search"
            className="text-xs text-muted-foreground"
          >
            {t("common.search")}
          </label>

          <Input
            id="stock-opname-search"
            value={search}
            placeholder={t(
              "stockOpnames.toolbar.searchPlaceholder",
            )}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
          />
        </div>

        <div className="space-y-1 lg:col-span-2">
          <label
            htmlFor="stock-opname-status"
            className="text-xs text-muted-foreground"
          >
            {t("stockOpnames.toolbar.statusLabel")}
          </label>

          <select
            id="stock-opname-status"
            value={status}
            aria-label={t(
              "stockOpnames.toolbar.statusLabel",
            )}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            onChange={(event) =>
              onStatusChange(
                event.target.value as
                  | StockOpnameStatus
                  | "all",
              )
            }
          >
            <option value="all">
              {t("stockOpnames.toolbar.allStatuses")}
            </option>

            <option value="draft">
              {t("stockOpnames.statuses.draft")}
            </option>

            <option value="finalized">
              {t("stockOpnames.statuses.finalized")}
            </option>

            <option value="cancelled">
              {t("stockOpnames.statuses.cancelled")}
            </option>
          </select>
        </div>

        <div className="space-y-1 lg:col-span-2">
          <label
            htmlFor="stock-opname-date-from"
            className="text-xs text-muted-foreground"
          >
            {t("stockOpnames.toolbar.dateFrom")}
          </label>

          <Input
            id="stock-opname-date-from"
            type="date"
            value={dateFrom}
            onChange={(event) =>
              onDateFromChange(event.target.value)
            }
          />
        </div>

        <div className="space-y-1 lg:col-span-2">
          <label
            htmlFor="stock-opname-date-to"
            className="text-xs text-muted-foreground"
          >
            {t("stockOpnames.toolbar.dateTo")}
          </label>

          <Input
            id="stock-opname-date-to"
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(event) =>
              onDateToChange(event.target.value)
            }
          />
        </div>

        <div className="flex items-end lg:col-span-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full"
            disabled={!hasActiveFilters}
            onClick={onResetFilters}
          >
            {t("stockOpnames.toolbar.reset")}
          </Button>
        </div>
      </div>
    </div>
  );
}