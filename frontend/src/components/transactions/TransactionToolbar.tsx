import {
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";

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
            placeholder="Search transaction no., product, SKU, or note"
            className="pl-9"
          />
        </div>

        <select
          value={paymentMethod}
          onChange={(event) =>
            onPaymentMethodChange(
              event.target.value as PaymentMethod | "all"
            )
          }
          className="h-10 rounded-md border bg-background px-3 text-sm sm:w-44"
          aria-label="Filter by payment method"
        >
          <option value="all">All Payments</option>
          <option value="cash">Cash</option>
          <option value="qris">QRIS</option>
          <option value="transfer">Transfer</option>
        </select>

        <Button
          type="button"
          variant="outline"
          disabled={!hasActiveFilters}
          onClick={onResetFilters}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <Button
        type="button"
        onClick={onAddTransaction}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Transaction
      </Button>
    </div>
  );
}