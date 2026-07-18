import { useTranslation } from "react-i18next";

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

export default function InventoryMovementTableSkeleton() {
  const { t } = useTranslation();

  return (
    <div className="min-h-0 flex-1 rounded-md border">
      <div className="h-full overflow-auto">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-background">
                {t("inventory.table.date")}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t("inventory.table.product")}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t("inventory.table.sku")}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t("inventory.table.type")}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background text-right">
                {t("inventory.table.quantity")}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background text-right">
                {t("inventory.table.before")}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background text-right">
                {t("inventory.table.after")}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t("inventory.table.reference")}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t("inventory.table.note")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-36" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>

                <TableCell>
                  <Skeleton className="ml-auto h-4 w-12" />
                </TableCell>

                <TableCell>
                  <Skeleton className="ml-auto h-4 w-12" />
                </TableCell>

                <TableCell>
                  <Skeleton className="ml-auto h-4 w-12" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}