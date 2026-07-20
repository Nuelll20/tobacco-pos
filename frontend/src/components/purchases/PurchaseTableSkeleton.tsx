import {
  useTranslation,
} from "react-i18next";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const rows = Array.from({
  length: 8,
});

export default function PurchaseTableSkeleton() {
  const { t } = useTranslation();

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
            {rows.map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-36" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>

                <TableCell>
                  <Skeleton className="ml-auto h-4 w-24" />
                </TableCell>

                <TableCell>
                  <Skeleton className="ml-auto h-4 w-24" />
                </TableCell>

                <TableCell>
                  <Skeleton className="ml-auto h-4 w-24" />
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-2">
                    {Array.from({
                      length: 4,
                    }).map(
                      (_, actionIndex) => (
                        <Skeleton
                          key={actionIndex}
                          className="size-8"
                        />
                      ),
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}