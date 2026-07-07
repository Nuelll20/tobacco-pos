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

import { Pencil, Trash2 } from "lucide-react";

type Props = {
  products: Product[];
  sortBy?: ProductSortBy;
  sortDirection?: SortDirection;
  onSort: (column: ProductSortBy) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);


const getSortLabel = (
  column: ProductSortBy,
  sortBy?: ProductSortBy,
  sortDirection?: SortDirection
) => {
  if (sortBy !== column) return "";

  return sortDirection === "asc" ? " ↑" : " ↓";
};
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
              <TableHead className="sticky top-0 z-10 bg-background">
                <button
                  type="button"
                  className="font-medium hover:text-foreground"
                  onClick={() => onSort("sku")}
                >
                  SKU{getSortLabel("sku", sortBy, sortDirection)}
                </button>
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                <button
                  type="button"
                  className="font-medium hover:text-foreground"
                  onClick={() => onSort("name")}
                >
                  Product{getSortLabel("name", sortBy, sortDirection)}
                </button>
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                Purchase
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                Selling
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                <button
                  type="button"
                  className="font-medium hover:text-foreground"
                  onClick={() => onSort("stock")}
                >
                  Stock{getSortLabel("stock", sortBy, sortDirection)}
                </button>
              </TableHead>

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
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(product)}
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
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
