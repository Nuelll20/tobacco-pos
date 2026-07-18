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

export default function ProductTableSkeleton() {
  const { t } = useTranslation();

  return (
    <div className="min-h-0 flex-1 rounded-md border">
      <div className="h-full overflow-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-background">
                {t("products.table.sku")}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t("products.table.product")}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "products.table.purchasePrice",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "products.table.sellingPrice",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t("products.table.stock")}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t("products.table.status")}
              </TableHead>

              <TableHead className="sticky top-0 z-10 w-36 bg-background text-center">
                {t("products.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Skeleton className="size-8" />
                      <Skeleton className="size-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}