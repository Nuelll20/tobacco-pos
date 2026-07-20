import {
  Eye,
  PackageCheck,
  Pencil,
  XCircle,
} from "lucide-react";
import {
  useTranslation,
} from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type {
  Purchase,
  PurchasePaymentStatus,
  PurchaseReceiptStatus,
} from "@/types/purchase";

type PurchaseTableProps = {
  purchases: Purchase[];
  onView: (
    purchase: Purchase,
  ) => void;
  onEdit: (
    purchase: Purchase,
  ) => void;
  onReceive: (
    purchase: Purchase,
  ) => void;
  onCancel: (
    purchase: Purchase,
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

export default function PurchaseTable({
  purchases,
  onView,
  onEdit,
  onReceive,
  onCancel,
}: PurchaseTableProps) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

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
        dateStyle: "medium",
      },
    ).format(date);
  }

  return (
    <div className="min-h-0 flex-1 rounded-md border">
      <div className="h-full overflow-auto">
        <Table className="min-w-[1450px]">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "purchases.table.purchaseNo",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "purchases.table.date",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "purchases.table.supplier",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "purchases.table.receiptStatus",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "purchases.table.paymentStatus",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background text-right">
                {t(
                  "purchases.table.total",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background text-right">
                {t(
                  "purchases.table.paid",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background text-right">
                {t(
                  "purchases.table.remaining",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 w-52 bg-background text-center">
                {t(
                  "purchases.table.actions",
                )}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {purchases.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-32 text-center text-muted-foreground"
                >
                  {t(
                    "purchases.table.empty",
                  )}
                </TableCell>
              </TableRow>
            ) : (
              purchases.map(
                (purchase) => {
                  const totalAmount =
                    Number(
                      purchase.total_amount,
                    );

                  const paidAmount =
                    Number(
                      purchase.paid_amount,
                    );

                  const remainingAmount =
                    Math.max(
                      totalAmount -
                        paidAmount,
                      0,
                    );

                  const canModify =
                    purchase.receipt_status ===
                      "draft" ||
                    purchase.receipt_status ===
                      "ordered";

                  return (
                    <TableRow
                      key={purchase.id}
                    >
                      <TableCell className="font-medium">
                        {
                          purchase.purchase_no
                        }
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {formatPurchaseDate(
                          purchase.purchase_date,
                        )}
                      </TableCell>

                      <TableCell>
                        {purchase.supplier
                          ?.name ?? "-"}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={
                            receiptStatusClassNames[
                              purchase
                                .receipt_status
                            ]
                          }
                        >
                          {t(
                            receiptStatusLabelKeys[
                              purchase
                                .receipt_status
                            ],
                          )}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={
                            paymentStatusClassNames[
                              purchase
                                .payment_status
                            ]
                          }
                        >
                          {t(
                            paymentStatusLabelKeys[
                              purchase
                                .payment_status
                            ],
                          )}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right font-medium">
                        {formatCurrency(
                          totalAmount,
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        {formatCurrency(
                          paidAmount,
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        {formatCurrency(
                          remainingAmount,
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={t(
                              "purchases.table.viewAria",
                              {
                                number:
                                  purchase.purchase_no,
                              },
                            )}
                            onClick={() =>
                              onView(
                                purchase,
                              )
                            }
                          >
                            <Eye className="size-4" />
                          </Button>

                          {canModify && (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label={t(
                                  "purchases.table.editAria",
                                  {
                                    number:
                                      purchase.purchase_no,
                                  },
                                )}
                                onClick={() =>
                                  onEdit(
                                    purchase,
                                  )
                                }
                              >
                                <Pencil className="size-4" />
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label={t(
                                  "purchases.table.receiveAria",
                                  {
                                    number:
                                      purchase.purchase_no,
                                  },
                                )}
                                onClick={() =>
                                  onReceive(
                                    purchase,
                                  )
                                }
                              >
                                <PackageCheck className="size-4" />
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                aria-label={t(
                                  "purchases.table.cancelAria",
                                  {
                                    number:
                                      purchase.purchase_no,
                                  },
                                )}
                                onClick={() =>
                                  onCancel(
                                    purchase,
                                  )
                                }
                              >
                                <XCircle className="size-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                },
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}