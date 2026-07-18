import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SupplierStatusFilter =
  | "all"
  | "active"
  | "inactive";

type SupplierToolbarProps = {
  search: string;
  status: SupplierStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: SupplierStatusFilter,
  ) => void;
  onAddSupplier: () => void;
};

export default function SupplierToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onAddSupplier,
}: SupplierToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={search}
          placeholder={t(
            "suppliers.toolbar.searchPlaceholder",
          )}
          className="w-full sm:w-80"
          onChange={(event) => {
            onSearchChange(
              event.target.value,
            );
          }}
        />

        <select
          value={status}
          aria-label={t(
            "suppliers.toolbar.statusLabel",
          )}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-44"
          onChange={(event) => {
            onStatusChange(
              event.target
                .value as SupplierStatusFilter,
            );
          }}
        >
          <option value="all">
            {t(
              "suppliers.toolbar.allStatuses",
            )}
          </option>

          <option value="active">
            {t(
              "suppliers.toolbar.active",
            )}
          </option>

          <option value="inactive">
            {t(
              "suppliers.toolbar.inactive",
            )}
          </option>
        </select>
      </div>

      <Button
        type="button"
        className="w-full lg:w-auto"
        onClick={onAddSupplier}
      >
        + {t(
          "suppliers.toolbar.addSupplier",
        )}
      </Button>
    </div>
  );
}

export type {
  SupplierStatusFilter,
};