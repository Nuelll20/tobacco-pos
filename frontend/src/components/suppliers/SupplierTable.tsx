import {
  ArrowDown,
  ArrowUp,
  Pencil,
  UserX,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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

import type {
  SortDirection,
  Supplier,
} from "@/types/supplier";

type SupplierTableProps = {
  suppliers: Supplier[];
  sortDirection: SortDirection;
  onSortName: () => void;
  onEdit: (supplier: Supplier) => void;
  onDeactivate: (
    supplier: Supplier,
  ) => void;
};

export default function SupplierTable({
  suppliers,
  sortDirection,
  onSortName,
  onEdit,
  onDeactivate,
}: SupplierTableProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-0 flex-1 rounded-md border">
      <div className="h-full overflow-auto">
        <Table className="min-w-[850px]">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-background">
                <button
                  type="button"
                  className="inline-flex items-center font-medium transition-colors hover:text-foreground"
                  onClick={onSortName}
                >
                  {t(
                    "suppliers.table.name",
                  )}

                  {sortDirection === "asc" ? (
                    <ArrowUp className="ml-2 size-3.5" />
                  ) : (
                    <ArrowDown className="ml-2 size-3.5" />
                  )}
                </button>
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "suppliers.table.phone",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "suppliers.table.address",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "suppliers.table.status",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 w-36 bg-background text-center">
                {t(
                  "suppliers.table.actions",
                )}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  {t(
                    "suppliers.table.empty",
                  )}
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">
                    <span
                      className="block max-w-64 truncate"
                      title={supplier.name}
                    >
                      {supplier.name}
                    </span>
                  </TableCell>

                  <TableCell>
                    {supplier.phone ?? "-"}
                  </TableCell>

                  <TableCell>
                    <span
                      className="block max-w-80 truncate"
                      title={
                        supplier.address ?? ""
                      }
                    >
                      {supplier.address ?? "-"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        supplier.is_active
                          ? "default"
                          : "secondary"
                      }
                    >
                      {supplier.is_active
                        ? t(
                            "suppliers.table.active",
                          )
                        : t(
                            "suppliers.table.inactive",
                          )}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={t(
                          "suppliers.table.editAria",
                          {
                            name:
                              supplier.name,
                          },
                        )}
                        onClick={() => {
                          onEdit(supplier);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        disabled={
                          !supplier.is_active
                        }
                        aria-label={t(
                          "suppliers.table.deactivateAria",
                          {
                            name:
                              supplier.name,
                          },
                        )}
                        onClick={() => {
                          onDeactivate(
                            supplier,
                          );
                        }}
                      >
                        <UserX className="size-4" />
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