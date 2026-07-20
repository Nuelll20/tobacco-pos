import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import SalesReportMostProfitableProducts from "@/components/reports/SalesReportMostProfitableProducts";
import SalesReportPagination from "@/components/reports/SalesReportPagination";
import SalesReportSummaryCards from "@/components/reports/SalesReportSummaryCards";
import SalesReportTable from "@/components/reports/SalesReportTable";
import SalesReportToolbar from "@/components/reports/SalesReportToolbar";
import SalesReportTopProducts from "@/components/reports/SalesReportTopProducts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSalesReport } from "@/hooks/useSalesReport";

import type {
  PaymentMethod,
} from "@/types/transaction";

export default function SalesReports() {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] =
    useState(10);
  const [search, setSearch] =
    useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<
    PaymentMethod | "all"
  >("all");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useSalesReport({
    page,
    per_page: perPage,
    search: search || undefined,
    payment_method:
      paymentMethod === "all"
        ? undefined
        : paymentMethod,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  });

  const report = data?.data;

  const hasActiveFilters =
    search !== "" ||
    paymentMethod !== "all" ||
    startDate !== "" ||
    endDate !== "";

  function handleResetFilters() {
    setSearch("");
    setPaymentMethod("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  }

  function handleStartDateChange(
    value: string,
  ) {
    setStartDate(value);

    if (
      value &&
      endDate &&
      endDate < value
    ) {
      setEndDate("");
    }

    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("reports.title")}
        </h1>

        <p className="mt-2 max-w-3xl text-muted-foreground">
          {t("reports.description")}
        </p>
      </div>

      <SalesReportToolbar
        search={search}
        paymentMethod={paymentMethod}
        startDate={startDate}
        endDate={endDate}
        hasActiveFilters={
          hasActiveFilters
        }
        isLoading={isFetching}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onPaymentMethodChange={(
          value,
        ) => {
          setPaymentMethod(value);
          setPage(1);
        }}
        onStartDateChange={
          handleStartDateChange
        }
        onEndDateChange={(value) => {
          setEndDate(value);
          setPage(1);
        }}
        onResetFilters={
          handleResetFilters
        }
      />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({
              length: 7,
            }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="space-y-2 pb-2">
                  <Skeleton className="h-4 w-28" />
                </CardHeader>

                <CardContent className="space-y-2">
                  <Skeleton className="h-8 w-36" />
                  <Skeleton className="h-3 w-44 max-w-full" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {Array.from({
              length: 2,
            }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-72 max-w-full" />
                </CardHeader>

                <CardContent className="space-y-3">
                  {Array.from({
                    length: 5,
                  }).map(
                    (_, productIndex) => (
                      <Skeleton
                        key={productIndex}
                        className="h-24 w-full"
                      />
                    ),
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-80 max-w-full" />
            </CardHeader>

            <CardContent>
              <Skeleton className="h-[520px] w-full" />
            </CardContent>
          </Card>
        </div>
      ) : isError || !report ? (
        <Card>
          <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <AlertCircle className="mb-4 size-10 text-destructive" />

            <h2 className="text-lg font-semibold">
              {t("reports.error.title")}
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {t(
                "reports.error.description",
              )}
            </p>

            <Button
              type="button"
              className="mt-5"
              onClick={() => {
                void refetch();
              }}
            >
              {t("reports.error.retry")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <SalesReportSummaryCards
            summary={report.summary}
          />

          <div className="grid items-start gap-6 xl:grid-cols-2">
            <SalesReportTopProducts
              products={
                report.top_products
              }
            />

            <SalesReportMostProfitableProducts
              products={
                report.most_profitable_products
              }
            />
          </div>

          <SalesReportTable
            transactions={
              report.transactions.data
            }
          />

          <SalesReportPagination
            currentPage={
              report.transactions
                .current_page
            }
            lastPage={
              report.transactions
                .last_page
            }
            total={
              report.transactions.total
            }
            perPage={
              report.transactions.per_page
            }
            from={
              report.transactions.from
            }
            to={report.transactions.to}
            onPageChange={setPage}
            onPerPageChange={(value) => {
              setPerPage(value);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}