import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";

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
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductTable({ products }: Props) {
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
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.sku}</TableCell>

            <TableCell>{product.name}</TableCell>

            <TableCell>{formatCurrency(product.purchase_price)}</TableCell>

            <TableCell>{formatCurrency(product.selling_price)}</TableCell>

            <TableCell>{product.stock}</TableCell>

            <TableCell>
              <Badge
                variant={product.is_active ? "default" : "secondary"}
              >
                {product.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}