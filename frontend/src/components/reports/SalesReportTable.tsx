import {
  AlertTriangle,
  ReceiptText,
} from "lucide-react";
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
  SalesReportTransaction,
} from "@/types/sales-report";
import type {
  PaymentMethod,
} from "@/types/transaction";

type SalesReportTableProps = {
  transactions: SalesReportTransaction[];
};

const paymentMethodLabelKeys: Record<
  PaymentMethod,
  string
> = {
  cash: "transactions.paymentMethods.cash",
  qris: "transactions.paymentMethods.qris",
  transfer:
    "transactions.paymentMethods.transfer",
};

export default function SalesReportTable({
  transactions,
}: SalesReportTableProps) {
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

  function formatPercentage(value: string) {
    return `${new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value))}%`;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("reports.transactions.title")}
        </CardTitle>

        <CardDescription>
          {t(
            "reports.transactions.description",
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed px-4 text-center">
            <ReceiptText className="mb-3 size-8 text-muted-foreground" />

            <p className="text-sm font-medium">
              {t(
                "reports.table.emptyTitle",
              )}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {t(
                "reports.table.emptyDescription",
              )}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table className="min-w-[1750px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-52">
                    {t(
                      "reports.table.productNames",
                    )}
                  </TableHead>

                  <TableHead className="min-w-44">
                    {t("reports.table.date")}
                  </TableHead>

                  <TableHead>
                    {t("reports.table.payment")}
                  </TableHead>

                  <TableHead className="text-right">
                    {t("reports.table.quantity")}
                  </TableHead>

                  <TableHead className="min-w-36 text-right">
                    {t("reports.table.unitPrice")}
                  </TableHead>

                  <TableHead className="min-w-36 text-right">
                    {t("reports.table.total")}
                  </TableHead>

                  <TableHead className="min-w-36 text-right">
                    {t("reports.table.cost")}
                  </TableHead>

                  <TableHead className="min-w-36 text-right">
                    {t(
                      "reports.table.grossProfit",
                    )}
                  </TableHead>

                  <TableHead className="min-w-28 text-right">
                    {t("reports.table.margin")}
                  </TableHead>

                  <TableHead className="min-w-36 text-right">
                    {t("reports.table.paid")}
                  </TableHead>

                  <TableHead className="min-w-36 text-right">
                    {t("reports.table.change")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions.map(
                  (transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="align-top"
                    >
                      <TableCell>
                        <div className="space-y-2">
                          {transaction.items.map(
                            (item) => (
                              <div
                                key={item.id}
                                className="min-h-10"
                              >
                                <p
                                  className="max-w-56 truncate text-sm font-medium"
                                  title={
                                    item.product_name
                                  }
                                >
                                  {
                                    item.product_name
                                  }
                                </p>

                                <p
                                  className="max-w-56 truncate text-xs text-muted-foreground"
                                  title={
                                    item.product_sku
                                  }
                                >
                                  {
                                    item.product_sku
                                  }
                                </p>
                              </div>
                            ),
                          )}
                        </div>
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
                              transaction
                                .payment_method
                            ],
                          )}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="space-y-2">
                          {transaction.items.map(
                            (item) => (
                              <div
                                key={item.id}
                                className="flex min-h-10 items-center justify-end"
                              >
                                {formatNumber(
                                  item.quantity,
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="space-y-2">
                          {transaction.items.map(
                            (item) => (
                              <div
                                key={item.id}
                                className="flex min-h-10 items-center justify-end whitespace-nowrap"
                              >
                                {formatCurrency(
                                  item.unit_price,
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-right font-semibold">
                        {formatCurrency(
                          transaction.total_amount,
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="space-y-1">
                          <p className="whitespace-nowrap font-medium">
                            {formatCurrency(
                              transaction.total_cost,
                            )}
                          </p>

                          {!transaction.profit_data_complete && (
                            <Badge
                              variant="outline"
                              className="gap-1 whitespace-nowrap text-amber-600"
                            >
                              <AlertTriangle className="size-3" />

                              {t(
                                "reports.table.partialData",
                              )}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="space-y-1">
                          <p className="whitespace-nowrap font-semibold text-emerald-600">
                            {formatCurrency(
                              transaction.gross_profit,
                            )}
                          </p>

                          {!transaction.profit_data_complete && (
                            <p className="text-xs text-muted-foreground">
                              {t(
                                "reports.table.availableCostOnly",
                              )}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <span className="whitespace-nowrap font-medium">
                          {formatPercentage(
                            transaction.gross_margin_percentage,
                          )}
                        </span>
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-right">
                        {formatCurrency(
                          transaction.paid_amount,
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-right">
                        {formatCurrency(
                          transaction.change_amount,
                        )}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}