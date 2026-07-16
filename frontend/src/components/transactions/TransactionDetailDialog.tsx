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

const paymentLabels: Record<PaymentMethod, string> = {
  cash: "Cash",
  qris: "QRIS",
  transfer: "Transfer",
};

const paymentClassNames: Record<PaymentMethod, string> = {
  cash: "bg-emerald-100 text-emerald-700",
  qris: "bg-sky-100 text-sky-700",
  transfer: "bg-violet-100 text-violet-700",
};

function formatCurrency(value: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function TransactionDetailDialog({
  open,
  transactionId,
  onOpenChange,
}: TransactionDetailDialogProps) {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useTransaction(transactionId, open);

  const transaction = data?.data;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Transaction Detail</DialogTitle>

          <DialogDescription>
            Review transaction information and purchased items.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="mt-4 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
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
              Failed to load transaction detail.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Please try loading the transaction again.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => {
                void refetch();
              }}
            >
              Try Again
            </Button>
          </div>
        ) : transaction ? (
          <div className="mt-4 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Transaction No.
                </p>

                <p className="font-semibold">
                  {transaction.transaction_no}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(transaction.created_at)}
                </p>
              </div>

              <Badge
                className={
                  paymentClassNames[transaction.payment_method]
                }
              >
                {paymentLabels[transaction.payment_method]}
              </Badge>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Total
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(transaction.total_amount)}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Paid
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(transaction.paid_amount)}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Change
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(transaction.change_amount)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">
                Purchased Items
              </h3>

              <div className="rounded-md border">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">
                        Qty
                      </TableHead>
                      <TableHead className="text-right">
                        Unit Price
                      </TableHead>
                      <TableHead className="text-right">
                        Subtotal
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {(transaction.items ?? []).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.product_name}
                        </TableCell>

                        <TableCell>
                          {item.product_sku}
                        </TableCell>

                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>

                        <TableCell className="text-right">
                          {formatCurrency(item.unit_price)}
                        </TableCell>

                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Note</p>

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