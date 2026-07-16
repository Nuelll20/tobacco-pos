import {
  CalendarDays,
  RotateCcw,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type {
  PaymentMethod,
} from "@/types/transaction";

type SalesReportToolbarProps = {
  search: string;
  paymentMethod: PaymentMethod | "all";
  startDate: string;
  endDate: string;
  hasActiveFilters: boolean;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onPaymentMethodChange: (
    value: PaymentMethod | "all"
  ) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onResetFilters: () => void;
};

export default function SalesReportToolbar({
  search,
  paymentMethod,
  startDate,
  endDate,
  hasActiveFilters,
  isLoading = false,
  onSearchChange,
  onPaymentMethodChange,
  onStartDateChange,
  onEndDateChange,
  onResetFilters,
}: SalesReportToolbarProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div>
        <h2 className="font-semibold">
          Report Filters
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Filter sales transactions by keyword, payment method, or date range.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <div className="relative lg:col-span-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            disabled={isLoading}
            placeholder="Search transaction, product, SKU, or note"
            className="pl-9"
            aria-label="Search sales report"
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
          />
        </div>

        <select
          value={paymentMethod}
          disabled={isLoading}
          className="h-10 rounded-md border bg-background px-3 text-sm lg:col-span-2"
          aria-label="Filter by payment method"
          onChange={(event) =>
            onPaymentMethodChange(
              event.target.value as PaymentMethod | "all"
            )
          }
        >
          <option value="all">
            All Payments
          </option>

          <option value="cash">
            Cash
          </option>

          <option value="qris">
            QRIS
          </option>

          <option value="transfer">
            Transfer
          </option>
        </select>

        <div className="space-y-1 lg:col-span-2">
          <Label
            htmlFor="report-start-date"
            className="sr-only"
          >
            Start Date
          </Label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="report-start-date"
              type="date"
              value={startDate}
              disabled={isLoading}
              className="pl-9"
              aria-label="Start date"
              onChange={(event) =>
                onStartDateChange(
                  event.target.value
                )
              }
            />
          </div>
        </div>

        <div className="space-y-1 lg:col-span-2">
          <Label
            htmlFor="report-end-date"
            className="sr-only"
          >
            End Date
          </Label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="report-end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              disabled={isLoading}
              className="pl-9"
              aria-label="End date"
              onChange={(event) =>
                onEndDateChange(
                  event.target.value
                )
              }
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={
            isLoading ||
            !hasActiveFilters
          }
          className="lg:col-span-2"
          onClick={onResetFilters}
        >
          <RotateCcw className="mr-2 size-4" />

          Reset
        </Button>
      </div>
    </div>
  );
}
