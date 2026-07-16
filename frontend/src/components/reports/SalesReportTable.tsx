import { FileSearch } from "lucide-react";

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

const paymentLabels: Record<
  PaymentMethod,
  string
> = {
  cash: "Cash",
  qris: "QRIS",
  transfer: "Transfer",
};

const paymentClassNames: Record<
  PaymentMethod,
  string
> = {
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
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function SalesReportTable({
  transactions,
}: SalesReportTableProps) {
  return (
    <div className="min-h-0 flex-1 rounded-md border">
      <div className="h-full overflow-auto">
        <Table className="min-w-[1200px]">
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
                Products
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
                      No sales transactions found
                    </p>

                    <p className="mt-1 text-xs">
                      Adjust the report filters to find matching transactions.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.transaction_no}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {formatDate(
                      transaction.created_at
                    )}
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

                  <TableCell className="text-right">
                    {transaction.products_sold.toLocaleString(
                      "id-ID"
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-right font-medium">
                    {formatCurrency(
                      transaction.total_amount
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-right">
                    {formatCurrency(
                      transaction.paid_amount
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-right">
                    {formatCurrency(
                      transaction.change_amount
                    )}
                  </TableCell>

                  <TableCell
                    className="max-w-[240px] truncate"
                    title={
                      transaction.note ||
                      undefined
                    }
                  >
                    {transaction.note || "-"}
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
