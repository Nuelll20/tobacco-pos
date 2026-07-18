import { ReceiptText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type {
  DashboardRecentTransaction,
} from "@/types/dashboard";
import type {
  PaymentMethod,
} from "@/types/transaction";

type DashboardRecentTransactionsProps = {
  data: DashboardRecentTransaction[];
};

const paymentMethodLabelKeys: Record<
  PaymentMethod,
  string
> = {
  cash: "dashboard.paymentMethods.cash",
  qris: "dashboard.paymentMethods.qris",
  transfer: "dashboard.paymentMethods.transfer",
};

export default function DashboardRecentTransactions({
  data,
}: DashboardRecentTransactionsProps) {
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

  function formatDateTime(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  function formatNumber(value: number) {
    return new Intl.NumberFormat(
      locale,
    ).format(value);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t(
            "dashboard.recentTransactions.title",
          )}
        </CardTitle>

        <CardDescription>
          {t(
            "dashboard.recentTransactions.description",
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-md border border-dashed px-4 text-center">
            <ReceiptText className="mb-3 size-8 text-muted-foreground" />

            <p className="text-sm font-medium">
              {t(
                "dashboard.recentTransactions.emptyTitle",
              )}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {t(
                "dashboard.recentTransactions.emptyDescription",
              )}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t(
                      "dashboard.recentTransactions.columns.transaction",
                    )}
                  </TableHead>

                  <TableHead>
                    {t(
                      "dashboard.recentTransactions.columns.date",
                    )}
                  </TableHead>

                  <TableHead>
                    {t(
                      "dashboard.recentTransactions.columns.payment",
                    )}
                  </TableHead>

                  <TableHead className="text-right">
                    {t(
                      "dashboard.recentTransactions.columns.products",
                    )}
                  </TableHead>

                  <TableHead className="text-right">
                    {t(
                      "dashboard.recentTransactions.columns.total",
                    )}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.transaction_no}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDateTime(
                        transaction.created_at,
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        {t(
                          paymentMethodLabelKeys[
                            transaction.payment_method
                          ],
                        )}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      {formatNumber(
                        transaction.products_sold,
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-right font-medium">
                      {formatCurrency(
                        transaction.total_amount,
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}