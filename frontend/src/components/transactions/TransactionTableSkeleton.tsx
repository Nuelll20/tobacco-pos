import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const rows = Array.from({ length: 8 });

export default function TransactionTableSkeleton() {
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
            {rows.map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-44" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-32" />
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
                  <Skeleton className="ml-auto h-4 w-20" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>

                <TableCell>
                  <div className="flex justify-center">
                    <Skeleton className="size-8" />
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