import type { Product } from "@/types/product";

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
  Pencil,
  Trash2,
} from "lucide-react";

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="min-h-0 flex-1 rounded-md border">
      <div className="h-full overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-background">
                SKU
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                Product
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                Purchase
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                Selling
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                Stock
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
                    {/* existing row */}
                  </TableRow>
                ))
              )}
            </TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.sku}</TableCell>

                <TableCell>{product.name}</TableCell>

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
                      product.is_active
                        ? "default"
                        : "secondary"
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}