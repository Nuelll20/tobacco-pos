import {
  PackageSearch,
  Trophy,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  SalesReportTopProduct,
} from "@/types/sales-report";

type SalesReportTopProductsProps = {
  products: SalesReportTopProduct[];
};

function formatCurrency(value: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default function SalesReportTopProducts({
  products,
}: SalesReportTopProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Top Products
        </CardTitle>

        <CardDescription>
          Best-selling products from the filtered transactions.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {products.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed px-4 text-center">
            <PackageSearch className="mb-3 size-8 text-muted-foreground" />

            <p className="text-sm font-medium">
              No product sales found
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Top-selling products will appear when transactions match the filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product, index) => (
              <div
                key={`${product.product_id ?? "deleted"}-${product.product_sku}`}
                className="flex items-center justify-between gap-4 rounded-md border p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted font-semibold">
                    {index === 0 ? (
                      <Trophy className="size-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-medium"
                      title={product.product_name}
                    >
                      {product.product_name}
                    </p>

                    <p
                      className="truncate text-xs text-muted-foreground"
                      title={product.product_sku}
                    >
                      SKU: {product.product_sku}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <Badge variant="secondary">
                    {product.quantity_sold.toLocaleString(
                      "id-ID"
                    )}{" "}
                    sold
                  </Badge>

                  <p className="mt-1 text-sm font-semibold">
                    {formatCurrency(
                      product.total_sales
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
