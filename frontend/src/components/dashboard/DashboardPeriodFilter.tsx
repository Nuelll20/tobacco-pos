import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { DashboardPeriod } from "@/types/dashboard";

type DashboardPeriodFilterProps = {
  period: DashboardPeriod;
  startDate: string;
  endDate: string;
  isLoading?: boolean;
  onPeriodChange: (period: DashboardPeriod) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onApplyCustomPeriod: () => void;
};

export default function DashboardPeriodFilter({
  period,
  startDate,
  endDate,
  isLoading = false,
  onPeriodChange,
  onStartDateChange,
  onEndDateChange,
  onApplyCustomPeriod,
}: DashboardPeriodFilterProps) {
  const isCustomPeriod = period === "custom";

  const isCustomPeriodInvalid =
    !startDate ||
    !endDate ||
    endDate < startDate;

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 text-muted-foreground" />

          <h2 className="font-semibold">
            Sales Overview
          </h2>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Review sales performance for the selected period.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="dashboard-period">
            Period
          </Label>

          <select
            id="dashboard-period"
            value={period}
            disabled={isLoading}
            className="h-10 min-w-44 rounded-md border bg-background px-3 text-sm"
            onChange={(event) =>
              onPeriodChange(
                event.target.value as DashboardPeriod
              )
            }
          >
            <option value="today">Today</option>
            <option value="7_days">Last 7 Days</option>
            <option value="30_days">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {isCustomPeriod && (
          <>
            <div className="space-y-2">
              <Label htmlFor="dashboard-start-date">
                Start Date
              </Label>

              <Input
                id="dashboard-start-date"
                type="date"
                value={startDate}
                disabled={isLoading}
                onChange={(event) =>
                  onStartDateChange(event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dashboard-end-date">
                End Date
              </Label>

              <Input
                id="dashboard-end-date"
                type="date"
                value={endDate}
                min={startDate || undefined}
                disabled={isLoading}
                onChange={(event) =>
                  onEndDateChange(event.target.value)
                }
              />
            </div>

            <Button
              type="button"
              disabled={
                isLoading ||
                isCustomPeriodInvalid
              }
              onClick={onApplyCustomPeriod}
            >
              Apply
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
