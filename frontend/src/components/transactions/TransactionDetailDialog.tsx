import { useTranslation } from "react-i18next";

import type { PaymentMethod } from "@/types/transaction";

import { useTransaction } from "@/hooks/useTransaction";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TransactionDetailDialogProps = {
  open: boolean;
  transactionId: number | null;
  onOpenChange: (open: boolean) => void;
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

export default function TransactionDetailDialog({
  open,
  transactionId,
  onOpenChange,
}: TransactionDetailDialogProps) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useTransaction(transactionId, open);

  const transaction = data?.data;

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
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {t("transactions.detail.title")}
          </DialogTitle>

          <DialogDescription>
            {t(
              "transactions.detail.description",
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="mt-4 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-20 rounded-lg"
                />
              ))}
            </div>

            <Skeleton className="h-48 rounded-lg" />
          </div>
        ) : isError ? (
          <div className="mt-4 flex flex-col items-center rounded-md border border-dashed p-8 text-center">
            <p className="font-medium">
              {t(
                "transactions.detail.errorTitle",
              )}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "transactions.detail.errorDescription",
              )}
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => {
                void refetch();
              }}
            >
              {t(
                "transactions.detail.retry",
              )}
            </Button>
          </div>
        ) : transaction ? (
          <div className="mt-4 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t(
                    "transactions.detail.transactionNo",
                  )}
                </p>

                <p className="font-semibold">
                  {
                    transaction.transaction_no
                  }
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(
                    transaction.created_at,
                  )}
                </p>
              </div>

              <Badge
                className={
                  paymentClassNames[
                    transaction.payment_method
                  ]
                }
              >
                {t(
                  paymentLabelKeys[
                    transaction.payment_method
                  ],
                )}
              </Badge>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  {t(
                    "transactions.detail.total",
                  )}
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(
                    transaction.total_amount,
                  )}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  {t(
                    "transactions.detail.paid",
                  )}
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(
                    transaction.paid_amount,
                  )}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  {t(
                    "transactions.detail.change",
                  )}
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(
                    transaction.change_amount,
                  )}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">
                {t(
                  "transactions.detail.purchasedItems",
                )}
              </h3>

              <div className="overflow-auto rounded-md border">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t(
                          "transactions.detail.product",
                        )}
                      </TableHead>

                      <TableHead>
                        {t(
                          "transactions.detail.sku",
                        )}
                      </TableHead>

                      <TableHead className="text-right">
                        {t(
                          "transactions.detail.quantity",
                        )}
                      </TableHead>

                      <TableHead className="text-right">
                        {t(
                          "transactions.detail.unitPrice",
                        )}
                      </TableHead>

                      <TableHead className="text-right">
                        {t(
                          "transactions.detail.subtotal",
                        )}
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {(transaction.items ?? []).map(
                      (item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.product_name}
                          </TableCell>

                          <TableCell>
                            {item.product_sku}
                          </TableCell>

                          <TableCell className="text-right">
                            {formatNumber(
                              item.quantity,
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            {formatCurrency(
                              item.unit_price,
                            )}
                          </TableCell>

                          <TableCell className="text-right font-medium">
                            {formatCurrency(
                              item.subtotal,
                            )}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">
                {t(
                  "transactions.detail.note",
                )}
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                {transaction.note || "-"}
              </p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}