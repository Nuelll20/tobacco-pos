import { useTranslation } from "react-i18next";

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
  InventoryMovement,
} from "@/types/inventory";

interface InventoryMovementTableProps {
  movements: InventoryMovement[];
}

const movementLabelKeys: Record<
  InventoryMovement["type"],
  string
> = {
  stock_in:
    "inventory.movementTypes.stockIn",
  stock_out:
    "inventory.movementTypes.stockOut",
  adjustment:
    "inventory.movementTypes.adjustment",
};

const movementClassNames: Record<
  InventoryMovement["type"],
  string
> = {
  stock_in:
    "bg-emerald-100 text-emerald-700",
  stock_out:
    "bg-rose-100 text-rose-700",
  adjustment:
    "bg-amber-100 text-amber-700",
};

export default function InventoryMovementTable({
  movements,
}: InventoryMovementTableProps) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

  function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  function formatNumber(value: number) {
    return new Intl.NumberFormat(
      locale,
    ).format(value);
  }

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
            {movements.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-32 text-center text-muted-foreground"
                >
                  {t("inventory.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(
                      movement.created_at,
                    )}
                  </TableCell>

                  <TableCell className="font-medium">
                    {movement.product?.name ?? "-"}
                  </TableCell>

                  <TableCell>
                    {movement.product?.sku ?? "-"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        movementClassNames[
                          movement.type
                        ]
                      }
                    >
                      {t(
                        movementLabelKeys[
                          movement.type
                        ],
                      )}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    {formatNumber(
                      movement.quantity,
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {formatNumber(
                      movement.stock_before,
                    )}
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    {formatNumber(
                      movement.stock_after,
                    )}
                  </TableCell>

                  <TableCell
                    className="max-w-[180px] truncate"
                    title={
                      movement.reference_no ||
                      undefined
                    }
                  >
                    {movement.reference_no || "-"}
                  </TableCell>

                  <TableCell
                    className="max-w-[220px] truncate"
                    title={
                      movement.note ||
                      undefined
                    }
                  >
                    {movement.note || "-"}
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