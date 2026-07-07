import { Pencil } from "lucide-react";

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

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
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
}: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Purchase</TableHead>
          <TableHead>Selling</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-28 text-center">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
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
                {product.is_active
                  ? "Active"
                  : "Inactive"}
              </Badge>
            </TableCell>

            <TableCell>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(product)}
                >
                  <Pencil className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}