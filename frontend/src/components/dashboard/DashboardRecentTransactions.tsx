import { ReceiptText } from "lucide-react";

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

const paymentMethodLabels: Record<
  PaymentMethod,
  string
> = {
  cash: "Cash",
  qris: "QRIS",
  transfer: "Transfer",
};

function formatCurrency(value: string) {
  return new Intl.NumberFormat("id-ID", {
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

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function DashboardRecentTransactions({
  data,
}: DashboardRecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Recent Transactions
        </CardTitle>

        <CardDescription>
          Latest transactions within the selected period.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-md border border-dashed px-4 text-center">
            <ReceiptText className="mb-3 size-8 text-muted-foreground" />

            <p className="text-sm font-medium">
              No transactions found
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Transactions for the selected period will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Transaction
                  </TableHead>

                  <TableHead>
                    Date
                  </TableHead>

                  <TableHead>
                    Payment
                  </TableHead>

                  <TableHead className="text-right">
                    Products
                  </TableHead>

                  <TableHead className="text-right">
                    Total
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
                        transaction.created_at
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        {
                          paymentMethodLabels[
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
