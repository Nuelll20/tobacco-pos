import {
  Banknote,
  CreditCard,
  QrCode,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  DashboardPaymentMethod,
} from "@/types/dashboard";
import type {
  PaymentMethod,
} from "@/types/transaction";

type DashboardPaymentMethodsProps = {
  data: DashboardPaymentMethod[];
};

const paymentMethodMeta: Record<
  PaymentMethod,
  {
    label: string;
    icon: typeof Banknote;
  }
> = {
  cash: {
    label: "Cash",
    icon: Banknote,
  },
  qris: {
    label: "QRIS",
    icon: QrCode,
  },
  transfer: {
    label: "Transfer",
    icon: CreditCard,
  },
};

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default function DashboardPaymentMethods({
  data,
}: DashboardPaymentMethodsProps) {
  const totalSales = data.reduce(
    (total, item) =>
      total + Number(item.total_sales),
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Payment Methods
        </CardTitle>

        <CardDescription>
          Sales distribution by payment method.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {data.map((item) => {
          const meta =
            paymentMethodMeta[
              item.payment_method
            ];

          const Icon = meta.icon;

          const percentage =
            totalSales > 0
              ? (
                  (
                    Number(item.total_sales) /
                    totalSales
                  ) * 100
                ).toFixed(1)
              : "0.0";

          return (
            <div
              key={item.payment_method}
              className="space-y-2"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-md border bg-muted/40">
                    <Icon className="size-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {meta.label}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.transaction_count.toLocaleString(
                        "id-ID"
                      )}{" "}
                      transactions
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {formatCurrency(
                      item.total_sales
                    )}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {percentage}%
                  </p>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
