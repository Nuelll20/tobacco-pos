import {
  AlertTriangle,
  PackageCheck,
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
  DashboardLowStockProduct,
} from "@/types/dashboard";

type DashboardLowStockProductsProps = {
  data: DashboardLowStockProduct[];
};

export default function DashboardLowStockProducts({
  data,
}: DashboardLowStockProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Low Stock Products
        </CardTitle>

        <CardDescription>
          Active products that need stock replenishment.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-md border border-dashed px-4 text-center">
            <PackageCheck className="mb-3 size-8 text-muted-foreground" />

            <p className="text-sm font-medium">
              Stock levels are healthy
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              No active products are currently below their minimum stock.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 rounded-md border p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                    <AlertTriangle className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-medium"
                      title={product.name}
                    >
                      {product.name}
                    </p>

                    <p
                      className="truncate text-xs text-muted-foreground"
                      title={product.sku}
                    >
                      SKU: {product.sku}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <Badge variant="destructive">
                    Stock {product.stock}
                  </Badge>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Minimum {product.minimum_stock}
                  </p>

                  <p className="text-xs font-medium text-destructive">
                    Short {product.stock_shortage}
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
