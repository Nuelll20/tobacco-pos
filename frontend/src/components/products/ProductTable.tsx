import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Pencil,
  Trash2,
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
  Product,
  ProductSortBy,
  SortDirection,
} from "@/types/product";

type Props = {
  products: Product[];
  sortBy?: ProductSortBy;
  sortDirection?: SortDirection;
  onSort: (column: ProductSortBy) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

type SortableTableHeadProps = {
  label: string;
  column: ProductSortBy;
  sortBy?: ProductSortBy;
  sortDirection?: SortDirection;
  onSort: (column: ProductSortBy) => void;
};

function getSortIcon(
  column: ProductSortBy,
  sortBy?: ProductSortBy,
  sortDirection?: SortDirection,
) {
  if (sortBy !== column) {
    return (
      <ArrowUpDown className="ml-2 size-3.5 opacity-40" />
    );
  }

  if (sortDirection === "asc") {
    return (
      <ArrowUp className="ml-2 size-3.5" />
    );
  }

  return (
    <ArrowDown className="ml-2 size-3.5" />
  );
}

function SortableTableHead({
  label,
  column,
  sortBy,
  sortDirection,
  onSort,
}: SortableTableHeadProps) {
  const isActive = sortBy === column;

  return (
    <TableHead
      className="sticky top-0 z-10 bg-background"
      aria-sort={
        isActive
          ? sortDirection === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <button
        type="button"
        className="inline-flex items-center font-medium transition-colors hover:text-foreground"
        onClick={() => onSort(column)}
      >
        {label}

        {getSortIcon(
          column,
          sortBy,
          sortDirection,
        )}
      </button>
    </TableHead>
  );
}

export default function ProductTable({
  products,
  sortBy,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}: Props) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

  function formatCurrency(value: number) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatNumber(value: number) {
    return new Intl.NumberFormat(
      locale,
    ).format(value);
  }

  return (
    <div className="min-h-0 flex-1 rounded-md border">
      <div className="h-full overflow-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <SortableTableHead
                label={t("products.table.sku")}
                column="sku"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <SortableTableHead
                label={t(
                  "products.table.product",
                )}
                column="name"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

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

              <SortableTableHead
                label={t("products.table.stock")}
                column="stock"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <TableHead className="sticky top-0 z-10 bg-background">
                {t("products.table.status")}
              </TableHead>

              <TableHead className="sticky top-0 z-10 w-36 bg-background text-center">
                {t("products.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  {t("products.table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.sku}
                  </TableCell>

                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>

                  <TableCell>
                    {formatCurrency(
                      product.purchase_price,
                    )}
                  </TableCell>

                  <TableCell>
                    {formatCurrency(
                      product.selling_price,
                    )}
                  </TableCell>

                  <TableCell>
                    {formatNumber(product.stock)}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        product.is_active
                          ? "default"
                          : "secondary"
                      }
                    >
                      {product.is_active
                        ? t(
                            "products.table.active",
                          )
                        : t(
                            "products.table.inactive",
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
                          "products.table.editAria",
                          {
                            name: product.name,
                          },
                        )}
                        onClick={() =>
                          onEdit(product)
                        }
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        aria-label={t(
                          "products.table.deleteAria",
                          {
                            name: product.name,
                          },
                        )}
                        onClick={() =>
                          onDelete(product)
                        }
                      >
                        <Trash2 className="size-4" />
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