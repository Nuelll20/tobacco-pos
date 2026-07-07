import type {
  Product,
  ProductSortBy,
  SortDirection,
} from "@/types/product";

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

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Pencil,
  Trash2,
} from "lucide-react";

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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const getSortIcon = (
  column: ProductSortBy,
  sortBy?: ProductSortBy,
  sortDirection?: SortDirection
) => {
  if (sortBy !== column) {
    return <ArrowUpDown className="ml-2 size-3.5 opacity-40" />;
  }

  if (sortDirection === "asc") {
    return <ArrowUp className="ml-2 size-3.5" />;
  }

  return <ArrowDown className="ml-2 size-3.5" />;
};

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
        {getSortIcon(column, sortBy, sortDirection)}
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
  return (
    <div className="min-h-0 flex-1 rounded-md border">
      <div className="h-full overflow-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <SortableTableHead
                label="SKU"
                column="sku"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <SortableTableHead
                label="Product"
                column="name"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <TableHead className="sticky top-0 z-10 bg-background">
                Purchase
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                Selling
              </TableHead>

              <SortableTableHead
                label="Stock"
                column="stock"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <TableHead className="sticky top-0 z-10 bg-background">
                Status
              </TableHead>

              <TableHead className="sticky top-0 z-10 w-36 bg-background text-center">
                Actions
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
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.sku}</TableCell>

                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>

                  <TableCell>
                    {formatCurrency(product.purchase_price)}
                  </TableCell>

                  <TableCell>
                    {formatCurrency(product.selling_price)}
                  </TableCell>

                  <TableCell>{product.stock}</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        product.is_active ? "default" : "secondary"
                      }
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Edit ${product.name}`}
                        onClick={() => onEdit(product)}
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        aria-label={`Delete ${product.name}`}
                        onClick={() => onDelete(product)}
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