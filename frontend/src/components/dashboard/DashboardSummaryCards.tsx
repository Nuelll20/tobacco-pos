import {
  DollarSign,
  Package,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { DashboardSummaryMetrics } from "@/types/dashboard";

type DashboardSummaryCardsProps = {
  summary: DashboardSummaryMetrics;
};

export default function DashboardSummaryCards({
  summary,
}: DashboardSummaryCardsProps) {
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
    return value.toLocaleString(locale);
  }

  const cards = [
    {
      title: t(
        "dashboard.summary.totalSales.title",
      ),
      value: formatCurrency(
        summary.total_sales,
      ),
      description: t(
        "dashboard.summary.totalSales.description",
      ),
      icon: DollarSign,
    },
    {
      title: t(
        "dashboard.summary.transactions.title",
      ),
      value: formatNumber(
        summary.transaction_count,
      ),
      description: t(
        "dashboard.summary.transactions.description",
      ),
      icon: Receipt,
    },
    {
      title: t(
        "dashboard.summary.productsSold.title",
      ),
      value: formatNumber(
        summary.products_sold,
      ),
      description: t(
        "dashboard.summary.productsSold.description",
      ),
      icon: Package,
    },
    {
      title: t(
        "dashboard.summary.averageTransaction.title",
      ),
      value: formatCurrency(
        summary.average_transaction,
      ),
      description: t(
        "dashboard.summary.averageTransaction.description",
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