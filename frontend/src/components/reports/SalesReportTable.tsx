import { FileSearch } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
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

const paymentLabelKeys: Record<
  PaymentMethod,
  string
> = {
  cash: "transactions.paymentMethods.cash",
  qris: "transactions.paymentMethods.qris",
  transfer:
    "transactions.paymentMethods.transfer",
};

const paymentClassNames: Record<
  PaymentMethod,
  string
> = {
  cash: "bg-emerald-100 text-emerald-700",
  qris: "bg-sky-100 text-sky-700",
  transfer:
    "bg-violet-100 text-violet-700",
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

  function formatDate(value: string) {
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
    <div className="min-h-0 flex-1 overflow-hidden rounded-md border">
      <Table className="min-w-[1080px]">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky top-0 z-10 min-w-[200px] bg-background">
              {t(
                "reports.table.productNames",
              )}
            </TableHead>

            <TableHead className="sticky top-0 z-10 min-w-[160px] bg-background">
              {t("reports.table.date")}
            </TableHead>

            <TableHead className="sticky top-0 z-10 min-w-[120px] bg-background">
              {t("reports.table.payment")}
            </TableHead>

            <TableHead className="sticky top-0 z-10 min-w-[120px] bg-background text-right">
              {t("reports.table.quantity")}
            </TableHead>

            <TableHead className="sticky top-0 z-10 min-w-[130px] bg-background text-right">
              {t("reports.table.unitPrice")}
            </TableHead>

            <TableHead className="sticky top-0 z-10 min-w-[120px] bg-background text-right">
              {t("reports.table.total")}
            </TableHead>

            <TableHead className="sticky top-0 z-10 min-w-[120px] bg-background text-right">
              {t("reports.table.paid")}
            </TableHead>

            <TableHead className="sticky top-0 z-10 min-w-[120px] bg-background text-right">
              {t("reports.table.change")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-48 text-center"
              >
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <FileSearch className="mb-3 size-8" />

                  <p className="text-sm font-medium text-foreground">
                    {t(
                      "reports.table.emptyTitle",
                    )}
                  </p>

                  <p className="mt-1 text-xs">
                    {t(
                      "reports.table.emptyDescription",
                    )}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            transactions.map(
              (
                transaction,
                transactionIndex,
              ) => {
                const items =
                  transaction.items.length > 0
                    ? transaction.items
                    : [null];

                return items.map(
                  (item, itemIndex) => (
                    <TableRow
                      key={
                        item
                          ? `${transaction.id}-${item.id}`
                          : `${transaction.id}-empty`
                      }
                      className={
                        transactionIndex > 0 &&
                        itemIndex === 0
                          ? "border-t-2"
                          : undefined
                      }
                    >
                      <TableCell className="align-middle">
                        {item ? (
                          <div className="min-w-0">
                            <p
                              className="font-medium"
                              title={
                                item.product_name
                              }
                            >
                              {
                                item.product_name
                              }
                            </p>

                            <p
                              className="mt-0.5 text-xs text-muted-foreground"
                              title={
                                item.product_sku
                              }
                            >
                              {item.product_sku}
                            </p>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap align-middle">
                        {formatDate(
                          transaction.created_at,
                        )}
                      </TableCell>

                      <TableCell className="align-middle">
                        <Badge
                          className={
                            paymentClassNames[
                              transaction
                                .payment_method
                            ]
                          }
                        >
                          {t(
                            paymentLabelKeys[
                              transaction
                                .payment_method
                            ],
                          )}
                        </Badge>
                      </TableCell>

                      <TableCell className="whitespace-nowrap align-middle text-right">
                        {item
                          ? formatNumber(
                              item.quantity,
                            )
                          : "-"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap align-middle text-right">
                        {item
                          ? formatCurrency(
                              item.unit_price,
                            )
                          : "-"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap align-middle text-right font-medium">
                        {item
                          ? formatCurrency(
                              item.subtotal,
                            )
                          : formatCurrency(
                              transaction.total_amount,
                            )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap align-middle text-right">
                        {itemIndex === 0
                          ? formatCurrency(
                              transaction.paid_amount,
                            )
                          : "-"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap align-middle text-right">
                        {itemIndex === 0
                          ? formatCurrency(
                              transaction.change_amount,
                            )
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ),
                );
              },
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}