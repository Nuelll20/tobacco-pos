import {
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  useTranslation,
} from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useSuppliers } from "@/hooks/useSuppliers";

import type {
  PurchasePaymentStatus,
  PurchaseReceiptStatus,
} from "@/types/purchase";

type PurchaseToolbarProps = {
  search: string;
  supplierId: number | "all";
  receiptStatus:
    | PurchaseReceiptStatus
    | "all";
  paymentStatus:
    | PurchasePaymentStatus
    | "all";
  dateFrom: string;
  dateTo: string;
  hasActiveFilters: boolean;

  onSearchChange: (
    value: string,
  ) => void;

  onSupplierIdChange: (
    value: number | "all",
  ) => void;

  onReceiptStatusChange: (
    value:
      | PurchaseReceiptStatus
      | "all",
  ) => void;

  onPaymentStatusChange: (
    value:
      | PurchasePaymentStatus
      | "all",
  ) => void;

  onDateFromChange: (
    value: string,
  ) => void;

  onDateToChange: (
    value: string,
  ) => void;

  onResetFilters: () => void;
  onAddPurchase: () => void;
};

export default function PurchaseToolbar({
  search,
  supplierId,
  receiptStatus,
  paymentStatus,
  dateFrom,
  dateTo,
  hasActiveFilters,
  onSearchChange,
  onSupplierIdChange,
  onReceiptStatusChange,
  onPaymentStatusChange,
  onDateFromChange,
  onDateToChange,
  onResetFilters,
  onAddPurchase,
}: PurchaseToolbarProps) {
  const { t } = useTranslation();

  const {
    data: suppliersData,
    isLoading: isSuppliersLoading,
  } = useSuppliers({
    per_page: 100,
    sort_by: "name",
    sort_direction: "asc",
  });

  const suppliers =
    suppliersData?.data ?? [];

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder={t(
              "purchases.toolbar.searchPlaceholder",
            )}
            className="pl-9"
          />
        </div>

        <Button
          type="button"
          onClick={onAddPurchase}
        >
          <Plus className="mr-2 size-4" />

          {t(
            "purchases.toolbar.addPurchase",
          )}
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <select
          value={supplierId}
          disabled={isSuppliersLoading}
          className="h-10 rounded-md border bg-background px-3 text-sm"
          aria-label={t(
            "purchases.toolbar.supplierFilterAria",
          )}
          onChange={(event) => {
            const value =
              event.target.value;

            onSupplierIdChange(
              value === "all"
                ? "all"
                : Number(value),
            );
          }}
        >
          <option value="all">
            {isSuppliersLoading
              ? t(
                  "purchases.toolbar.loadingSuppliers",
                )
              : t(
                  "purchases.toolbar.allSuppliers",
                )}
          </option>

          {suppliers.map(
            (supplier) => (
              <option
                key={supplier.id}
                value={supplier.id}
              >
                {supplier.name}
              </option>
            ),
          )}
        </select>

        <select
          value={receiptStatus}
          className="h-10 rounded-md border bg-background px-3 text-sm"
          aria-label={t(
            "purchases.toolbar.receiptStatusFilterAria",
          )}
          onChange={(event) =>
            onReceiptStatusChange(
              event.target.value as
                | PurchaseReceiptStatus
                | "all",
            )
          }
        >
          <option value="all">
            {t(
              "purchases.toolbar.allReceiptStatuses",
            )}
          </option>

          <option value="draft">
            {t(
              "purchases.receiptStatuses.draft",
            )}
          </option>

          <option value="ordered">
            {t(
              "purchases.receiptStatuses.ordered",
            )}
          </option>

          <option value="received">
            {t(
              "purchases.receiptStatuses.received",
            )}
          </option>

          <option value="cancelled">
            {t(
              "purchases.receiptStatuses.cancelled",
            )}
          </option>
        </select>

        <select
          value={paymentStatus}
          className="h-10 rounded-md border bg-background px-3 text-sm"
          aria-label={t(
            "purchases.toolbar.paymentStatusFilterAria",
          )}
          onChange={(event) =>
            onPaymentStatusChange(
              event.target.value as
                | PurchasePaymentStatus
                | "all",
            )
          }
        >
          <option value="all">
            {t(
              "purchases.toolbar.allPaymentStatuses",
            )}
          </option>

          <option value="unpaid">
            {t(
              "purchases.paymentStatuses.unpaid",
            )}
          </option>

          <option value="partial">
            {t(
              "purchases.paymentStatuses.partial",
            )}
          </option>

          <option value="paid">
            {t(
              "purchases.paymentStatuses.paid",
            )}
          </option>
        </select>

        <Input
          type="date"
          value={dateFrom}
          aria-label={t(
            "purchases.toolbar.dateFromAria",
          )}
          onChange={(event) =>
            onDateFromChange(
              event.target.value,
            )
          }
        />

        <Input
          type="date"
          value={dateTo}
          min={dateFrom || undefined}
          aria-label={t(
            "purchases.toolbar.dateToAria",
          )}
          onChange={(event) =>
            onDateToChange(
              event.target.value,
            )
          }
        />

        <Button
          type="button"
          variant="outline"
          disabled={!hasActiveFilters}
          onClick={onResetFilters}
        >
          <RotateCcw className="mr-2 size-4" />

          {t(
            "purchases.toolbar.reset",
          )}
        </Button>
      </div>
    </div>
  );
}