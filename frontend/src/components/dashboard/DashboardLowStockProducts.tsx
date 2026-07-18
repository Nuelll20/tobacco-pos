import {
  AlertTriangle,
  PackageCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

  function formatNumber(value: number) {
    return new Intl.NumberFormat(
      locale,
    ).format(value);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("dashboard.lowStock.title")}
        </CardTitle>

        <CardDescription>
          {t("dashboard.lowStock.description")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-md border border-dashed px-4 text-center">
            <PackageCheck className="mb-3 size-8 text-muted-foreground" />

            <p className="text-sm font-medium">
              {t(
                "dashboard.lowStock.healthyTitle",
              )}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {t(
                "dashboard.lowStock.healthyDescription",
              )}
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
                      {t("dashboard.lowStock.sku")}:{" "}
                      {product.sku}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <Badge variant="destructive">
                    {t(
                      "dashboard.lowStock.stock",
                      {
                        count: formatNumber(
                          product.stock,
                        ),
                      },
                    )}
                  </Badge>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {t(
                      "dashboard.lowStock.minimum",
                      {
                        count: formatNumber(
                          product.minimum_stock,
                        ),
                      },
                    )}
                  </p>

                  <p className="text-xs font-medium text-destructive">
                    {t(
                      "dashboard.lowStock.shortage",
                      {
                        count: formatNumber(
                          product.stock_shortage,
                        ),
                      },
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