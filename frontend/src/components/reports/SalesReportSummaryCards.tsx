import {
  Banknote,
  Package,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  SalesReportSummary,
} from "@/types/sales-report";

type SalesReportSummaryCardsProps = {
  summary: SalesReportSummary;
};

export default function SalesReportSummaryCards({
  summary,
}: SalesReportSummaryCardsProps) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

  function formatCurrency(value: string) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  }

  function formatNumber(value: number) {
    return new Intl.NumberFormat(
      locale,
    ).format(value);
  }

  const cards = [
    {
      title: t(
        "reports.summary.totalSales.title",
      ),
      value: formatCurrency(
        summary.total_sales,
      ),
      description: t(
        "reports.summary.totalSales.description",
      ),
      icon: Banknote,
    },
    {
      title: t(
        "reports.summary.transactions.title",
      ),
      value: formatNumber(
        summary.transaction_count,
      ),
      description: t(
        "reports.summary.transactions.description",
      ),
      icon: ReceiptText,
    },
    {
      title: t(
        "reports.summary.productsSold.title",
      ),
      value: formatNumber(
        summary.products_sold,
      ),
      description: t(
        "reports.summary.productsSold.description",
      ),
      icon: Package,
    },
    {
      title: t(
        "reports.summary.averageTransaction.title",
      ),
      value: formatCurrency(
        summary.average_transaction,
      ),
      description: t(
        "reports.summary.averageTransaction.description",
      ),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>

              <Icon className="size-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-2xl font-bold">
                {card.value}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}