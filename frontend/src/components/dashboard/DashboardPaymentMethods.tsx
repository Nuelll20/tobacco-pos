import {
  Banknote,
  CreditCard,
  QrCode,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
    labelKey: string;
    icon: typeof Banknote;
  }
> = {
  cash: {
    labelKey:
      "dashboard.paymentMethods.cash",
    icon: Banknote,
  },
  qris: {
    labelKey:
      "dashboard.paymentMethods.qris",
    icon: QrCode,
  },
  transfer: {
    labelKey:
      "dashboard.paymentMethods.transfer",
    icon: CreditCard,
  },
};

export default function DashboardPaymentMethods({
  data,
}: DashboardPaymentMethodsProps) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

  function formatCurrency(
    value: string | number,
  ) {
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

  const totalSales = data.reduce(
    (total, item) =>
      total + Number(item.total_sales),
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t(
            "dashboard.paymentMethods.title",
          )}
        </CardTitle>

        <CardDescription>
          {t(
            "dashboard.paymentMethods.description",
          )}
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
                  (Number(
                    item.total_sales,
                  ) /
                    totalSales) *
                  100
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
                      {t(meta.labelKey)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {t(
                        "dashboard.paymentMethods.transactions",
                        {
                          count:
                            formatNumber(
                              item.transaction_count,
                            ),
                        },
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {formatCurrency(
                      item.total_sales,
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