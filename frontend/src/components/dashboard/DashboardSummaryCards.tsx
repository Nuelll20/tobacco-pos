import {
  DollarSign,
  Package,
  Receipt,
  TrendingUp,
} from "lucide-react";

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

function formatCurrency(value: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default function DashboardSummaryCards({
  summary,
}: DashboardSummaryCardsProps) {
  const cards = [
    {
      title: "Total Sales",
      value: formatCurrency(summary.total_sales),
      description: "Revenue in the selected period",
      icon: DollarSign,
    },
    {
      title: "Transactions",
      value: summary.transaction_count.toLocaleString("id-ID"),
      description: "Completed sales transactions",
      icon: Receipt,
    },
    {
      title: "Products Sold",
      value: summary.products_sold.toLocaleString("id-ID"),
      description: "Total product quantity sold",
      icon: Package,
    },
    {
      title: "Average Transaction",
      value: formatCurrency(summary.average_transaction),
      description: "Average revenue per transaction",
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
