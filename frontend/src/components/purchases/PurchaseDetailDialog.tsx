import {
  useTranslation,
} from "react-i18next";

import { usePurchase } from "@/hooks/usePurchase";

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

import type {
  PurchasePaymentStatus,
  PurchaseReceiptStatus,
} from "@/types/purchase";

type PurchaseDetailDialogProps = {
  open: boolean;
  purchaseId: number | null;
  onOpenChange: (
    open: boolean,
  ) => void;
};

const receiptStatusLabelKeys: Record<
  PurchaseReceiptStatus,
  string
> = {
  draft:
    "purchases.receiptStatuses.draft",
  ordered:
    "purchases.receiptStatuses.ordered",
  received:
    "purchases.receiptStatuses.received",
  cancelled:
    "purchases.receiptStatuses.cancelled",
};

const receiptStatusClassNames: Record<
  PurchaseReceiptStatus,
  string
> = {
  draft:
    "bg-slate-100 text-slate-700",
  ordered:
    "bg-sky-100 text-sky-700",
  received:
    "bg-emerald-100 text-emerald-700",
  cancelled:
    "bg-rose-100 text-rose-700",
};

const paymentStatusLabelKeys: Record<
  PurchasePaymentStatus,
  string
> = {
  unpaid:
    "purchases.paymentStatuses.unpaid",
  partial:
    "purchases.paymentStatuses.partial",
  paid:
    "purchases.paymentStatuses.paid",
};

const paymentStatusClassNames: Record<
  PurchasePaymentStatus,
  string
> = {
  unpaid:
    "bg-rose-100 text-rose-700",
  partial:
    "bg-amber-100 text-amber-700",
  paid:
    "bg-emerald-100 text-emerald-700",
};

export default function PurchaseDetailDialog({
  open,
  purchaseId,
  onOpenChange,
}: PurchaseDetailDialogProps) {
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
  } = usePurchase(
    purchaseId,
    open,
  );

  const purchase = data?.data;

  function formatCurrency(
    value: string | number,
  ) {
    return new Intl.NumberFormat(
      locale,
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      },
    ).format(Number(value));
  }

  function formatNumber(
    value: number,
  ) {
    return new Intl.NumberFormat(
      locale,
    ).format(value);
  }

  function formatPurchaseDate(
    value: string,
  ) {
    const date = new Date(
      `${value}T00:00:00`,
    );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return "-";
    }

    return new Intl.DateTimeFormat(
      locale,
      {
        dateStyle: "long",
      },
    ).format(date);
  }

  function formatDateTime(
    value: string | null,
  ) {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return "-";
    }

    return new Intl.DateTimeFormat(
      locale,
      {
        dateStyle: "long",
        timeStyle: "short",
      },
    ).format(date);
  }

  const totalAmount =
    Number(
      purchase?.total_amount ?? 0,
    );

  const paidAmount =
    Number(
      purchase?.paid_amount ?? 0,
    );

  const remainingAmount =
    Math.max(
      totalAmount - paidAmount,
      0,
    );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {t(
              "purchases.detail.title",
            )}
          </DialogTitle>

          <DialogDescription>
            {t(
              "purchases.detail.description",
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

            <Skeleton className="h-52 rounded-lg" />
          </div>
        ) : isError ? (
          <div className="mt-4 flex flex-col items-center rounded-md border border-dashed p-8 text-center">
            <p className="font-medium">
              {t(
                "purchases.detail.errorTitle",
              )}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "purchases.detail.errorDescription",
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
                "purchases.detail.retry",
              )}
            </Button>
          </div>
        ) : purchase ? (
          <div className="mt-4 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t(
                    "purchases.detail.purchaseNo",
                  )}
                </p>

                <p className="font-semibold">
                  {purchase.purchase_no}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPurchaseDate(
                    purchase.purchase_date,
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  className={
                    receiptStatusClassNames[
                      purchase.receipt_status
                    ]
                  }
                >
                  {t(
                    receiptStatusLabelKeys[
                      purchase.receipt_status
                    ],
                  )}
                </Badge>

                <Badge
                  className={
                    paymentStatusClassNames[
                      purchase.payment_status
                    ]
                  }
                >
                  {t(
                    paymentStatusLabelKeys[
                      purchase.payment_status
                    ],
                  )}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  {t(
                    "purchases.detail.supplier",
                  )}
                </p>

                <p className="mt-1 font-semibold">
                  {purchase.supplier
                    ?.name ?? "-"}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  {t(
                    "purchases.detail.total",
                  )}
                </p>

                <p className="mt-1 font-semibold">
                  {formatCurrency(
                    totalAmount,
                  )}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  {t(
                    "purchases.detail.paid",
                  )}
                </p>

                <p className="mt-1 font-semibold">
                  {formatCurrency(
                    paidAmount,
                  )}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  {t(
                    "purchases.detail.remaining",
                  )}
                </p>

                <p className="mt-1 font-semibold">
                  {formatCurrency(
                    remainingAmount,
                  )}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">
                {t(
                  "purchases.detail.itemsTitle",
                )}
              </h3>

              <div className="overflow-auto rounded-md border">
                <Table className="min-w-[750px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t(
                          "purchases.detail.product",
                        )}
                      </TableHead>

                      <TableHead>
                        {t(
                          "purchases.detail.sku",
                        )}
                      </TableHead>

                      <TableHead className="text-right">
                        {t(
                          "purchases.detail.quantity",
                        )}
                      </TableHead>

                      <TableHead className="text-right">
                        {t(
                          "purchases.detail.unitCost",
                        )}
                      </TableHead>

                      <TableHead className="text-right">
                        {t(
                          "purchases.detail.subtotal",
                        )}
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {(purchase.items ?? []).map(
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
                              item.unit_cost,
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">
                  {t(
                    "purchases.detail.receivedAt",
                  )}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDateTime(
                    purchase.received_at,
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">
                  {t(
                    "purchases.detail.notes",
                  )}
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                  {purchase.notes || "-"}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}