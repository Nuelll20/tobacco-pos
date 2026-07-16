import {
  Banknote,
  Package,
  ReceiptText,
  TrendingUp,
} from "lucide-react";

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

function formatCurrency(value: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default function SalesReportSummaryCards({
  summary,
}: SalesReportSummaryCardsProps) {
  const cards = [
    {
      title: "Total Sales",
      value: formatCurrency(
        summary.total_sales
      ),
      description:
        "Revenue from all filtered transactions",
      icon: Banknote,
    },
    {
      title: "Transactions",
      value:
        summary.transaction_count.toLocaleString(
          "id-ID"
        ),
      description:
        "Number of matching transactions",
      icon: ReceiptText,
    },
    {
      title: "Products Sold",
      value:
        summary.products_sold.toLocaleString(
          "id-ID"
        ),
      description:
        "Total quantity sold in the report",
      icon: Package,
    },
    {
      title: "Average Transaction",
      value: formatCurrency(
        summary.average_transaction
      ),
      description:
        "Average value per transaction",
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
