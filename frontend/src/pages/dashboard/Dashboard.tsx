import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import DashboardLowStockProducts from "@/components/dashboard/DashboardLowStockProducts";
import DashboardPaymentMethods from "@/components/dashboard/DashboardPaymentMethods";
import DashboardPeriodFilter from "@/components/dashboard/DashboardPeriodFilter";
import DashboardRecentTransactions from "@/components/dashboard/DashboardRecentTransactions";
import DashboardSalesChart from "@/components/dashboard/DashboardSalesChart";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";

import type {
  DashboardPeriod,
  DashboardSummaryParams,
} from "@/types/dashboard";

export default function Dashboard() {
  const { t } = useTranslation();

  const [period, setPeriod] =
    useState<DashboardPeriod>("today");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [queryParams, setQueryParams] =
    useState<DashboardSummaryParams>({
      period: "today",
    });

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useDashboardSummary(queryParams);

  const dashboard = data?.data;

  function handlePeriodChange(
    nextPeriod: DashboardPeriod,
  ) {
    setPeriod(nextPeriod);

    if (nextPeriod !== "custom") {
      setQueryParams({
        period: nextPeriod,
      });
    }
  }

  function handleApplyCustomPeriod() {
    if (
      !startDate ||
      !endDate ||
      endDate < startDate
    ) {
      return;
    }

    setQueryParams({
      period: "custom",
      start_date: startDate,
      end_date: endDate,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {t("dashboard.title")}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {t("dashboard.description")}
        </p>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : isError || !dashboard ? (
        <Card>
          <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <AlertCircle className="mb-4 size-10 text-destructive" />

            <h2 className="text-lg font-semibold">
              {t("dashboard.error.title")}
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {t("dashboard.error.description")}
            </p>

            <Button
              type="button"
              className="mt-5"
              onClick={() => {
                void refetch();
              }}
            >
              {t("common.retry")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <DashboardPeriodFilter
            period={period}
            startDate={startDate}
            endDate={endDate}
            isLoading={isFetching}
            onPeriodChange={handlePeriodChange}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onApplyCustomPeriod={
              handleApplyCustomPeriod
            }
          />

          <DashboardSummaryCards
            summary={dashboard.summary}
          />

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="min-w-0 xl:col-span-2">
              <DashboardSalesChart
                data={dashboard.daily_sales}
              />
            </div>

            <DashboardPaymentMethods
              data={dashboard.payment_methods}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="min-w-0 xl:col-span-2">
              <DashboardRecentTransactions
                data={dashboard.recent_transactions}
              />
            </div>

            <DashboardLowStockProducts
              data={dashboard.low_stock_products}
            />
          </div>
        </>
      )}
    </div>
  );
}