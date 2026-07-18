import {
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type { PaymentMethod } from "@/types/transaction";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TransactionToolbarProps = {
  search: string;
  paymentMethod: PaymentMethod | "all";
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onPaymentMethodChange: (
    value: PaymentMethod | "all"
  ) => void;
  onResetFilters: () => void;
  onAddTransaction: () => void;
};

export default function TransactionToolbar({
  search,
  paymentMethod,
  hasActiveFilters,
  onSearchChange,
  onPaymentMethodChange,
  onResetFilters,
  onAddTransaction,
}: TransactionToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder={t(
              "transactions.toolbar.searchPlaceholder",
            )}
            className="pl-9"
          />
        </div>

        <select
          value={paymentMethod}
          onChange={(event) =>
            onPaymentMethodChange(
              event.target.value as
                | PaymentMethod
                | "all",
            )
          }
          className="h-10 rounded-md border bg-background px-3 text-sm sm:w-44"
          aria-label={t(
            "transactions.toolbar.paymentFilterAria",
          )}
        >
          <option value="all">
            {t(
              "transactions.toolbar.allPayments",
            )}
          </option>

          <option value="cash">
            {t(
              "transactions.paymentMethods.cash",
            )}
          </option>

          <option value="qris">
            {t(
              "transactions.paymentMethods.qris",
            )}
          </option>

          <option value="transfer">
            {t(
              "transactions.paymentMethods.transfer",
            )}
          </option>
        </select>

        <Button
          type="button"
          variant="outline"
          disabled={!hasActiveFilters}
          onClick={onResetFilters}
        >
          <RotateCcw className="mr-2 h-4 w-4" />

          {t("transactions.toolbar.reset")}
        </Button>
      </div>

      <Button
        type="button"
        onClick={onAddTransaction}
      >
        <Plus className="mr-2 h-4 w-4" />

        {t(
          "transactions.toolbar.newTransaction",
        )}
      </Button>
    </div>
  );
}