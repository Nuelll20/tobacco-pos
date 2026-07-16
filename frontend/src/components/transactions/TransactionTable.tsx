import { Eye } from "lucide-react";

import type {
  PaymentMethod,
  Transaction,
} from "@/types/transaction";

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

type TransactionTableProps = {
  transactions: Transaction[];
  onView: (transaction: Transaction) => void;
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
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function TransactionTable({
  transactions,
  onView,
}: TransactionTableProps) {
  return (
    <div className="min-h-0 flex-1 rounded-md border">
      <div className="h-full overflow-auto">
        <Table className="min-w-[1150px]">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-background">
                Transaction No.
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                Date
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                Payment
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background text-right">
                Total
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background text-right">
                Paid
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background text-right">
                Change
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                Note
              </TableHead>

              <TableHead className="sticky top-0 z-10 w-28 bg-background text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-muted-foreground"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.transaction_no}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {formatDate(transaction.created_at)}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        paymentClassNames[
                          transaction.payment_method
                        ]
                      }
                    >
                      {
                        paymentLabels[
                          transaction.payment_method
                        ]
                      }
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    {formatCurrency(transaction.total_amount)}
                  </TableCell>

                  <TableCell className="text-right">
                    {formatCurrency(transaction.paid_amount)}
                  </TableCell>

                  <TableCell className="text-right">
                    {formatCurrency(transaction.change_amount)}
                  </TableCell>

                  <TableCell
                    className="max-w-[240px] truncate"
                    title={transaction.note || undefined}
                  >
                    {transaction.note || "-"}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`View transaction ${transaction.transaction_no}`}
                        onClick={() => onView(transaction)}
                      >
                        <Eye className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}