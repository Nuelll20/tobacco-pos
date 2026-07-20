import {
  useWatch,
} from "react-hook-form";
import type {
  Control,
} from "react-hook-form";
import {
  useTranslation,
} from "react-i18next";

import { Badge } from "@/components/ui/badge";

import type {
  PurchaseFormData,
} from "@/schemas/purchase";
import type {
  PurchasePaymentStatus,
} from "@/types/purchase";

type PurchasePaymentSummaryProps = {
  control: Control<PurchaseFormData>;
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

export default function PurchasePaymentSummary({
  control,
}: PurchasePaymentSummaryProps) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

  const watchedItems =
    useWatch({
      control,
      name: "items",
    }) ?? [];

  const paidAmount =
    Number(
      useWatch({
        control,
        name: "paid_amount",
      }),
    ) || 0;

  const totalAmount =
    watchedItems.reduce(
      (total, item) => {
        const quantity =
          Number(item.quantity) || 0;

        const unitCost =
          Number(item.unit_cost) || 0;

        return (
          total +
          quantity * unitCost
        );
      },
      0,
    );

  const remainingAmount = Math.max(
    totalAmount - paidAmount,
    0,
  );

  const paymentStatus:
    PurchasePaymentStatus =
      paidAmount <= 0
        ? "unpaid"
        : paidAmount < totalAmount
          ? "partial"
          : "paid";

  function formatCurrency(
    value: number,
  ) {
    return new Intl.NumberFormat(
      locale,
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      },
    ).format(value);
  }

  return (
    <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <p className="text-sm text-muted-foreground">
          {t(
            "purchases.form.purchaseTotal",
          )}
        </p>

        <p className="mt-1 text-lg font-semibold">
          {formatCurrency(totalAmount)}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          {t(
            "purchases.form.paidAmount",
          )}
        </p>

        <p className="mt-1 text-lg font-semibold">
          {formatCurrency(paidAmount)}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          {t(
            "purchases.form.remainingAmount",
          )}
        </p>

        <p className="mt-1 text-lg font-semibold">
          {formatCurrency(
            remainingAmount,
          )}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          {t(
            "purchases.form.paymentStatus",
          )}
        </p>

        <div className="mt-2">
          <Badge
            className={
              paymentStatusClassNames[
                paymentStatus
              ]
            }
          >
            {t(
              paymentStatusLabelKeys[
                paymentStatus
              ],
            )}
          </Badge>
        </div>
      </div>
    </div>
  );
}