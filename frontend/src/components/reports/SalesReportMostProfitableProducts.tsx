import {
  CircleDollarSign,
  PackageSearch,
  Trophy,
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
  SalesReportProfitableProduct,
} from "@/types/sales-report";

type SalesReportMostProfitableProductsProps = {
  products: SalesReportProfitableProduct[];
};

export default function SalesReportMostProfitableProducts({
  products,
}: SalesReportMostProfitableProductsProps) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

  function formatCurrency(value: string) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  }

  function formatNumber(value: number) {
    return new Intl.NumberFormat(
      locale,
    ).format(value);
  }

  function formatPercentage(value: string) {
    return `${new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value))}%`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t(
            "reports.mostProfitableProducts.title",
          )}
        </CardTitle>

        <CardDescription>
          {t(
            "reports.mostProfitableProducts.description",
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {products.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed px-4 text-center">
            <PackageSearch className="mb-3 size-8 text-muted-foreground" />

            <p className="text-sm font-medium">
              {t(
                "reports.mostProfitableProducts.emptyTitle",
              )}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {t(
                "reports.mostProfitableProducts.emptyDescription",
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(
              (product, index) => (
                <div
                  key={`${
                    product.product_id ??
                    "deleted"
                  }-${product.product_sku}`}
                  className="rounded-md border p-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 font-semibold text-primary">
                        {index === 0 ? (
                          <Trophy className="size-4" />
                        ) : (
                          formatNumber(index + 1)
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="truncate text-sm font-medium"
                          title={
                            product.product_name
                          }
                        >
                          {product.product_name}
                        </p>

                        <p
                          className="truncate text-xs text-muted-foreground"
                          title={
                            product.product_sku
                          }
                        >
                          {t(
                            "reports.mostProfitableProducts.sku",
                            {
                              sku:
                                product.product_sku,
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="flex items-center justify-end gap-1 text-sm font-semibold">
                        <CircleDollarSign className="size-4 text-primary" />

                        {formatCurrency(
                          product.gross_profit,
                        )}
                      </div>

                      <Badge
                        variant="secondary"
                        className="mt-1"
                      >
                        {t(
                          "reports.mostProfitableProducts.margin",
                          {
                            margin:
                              formatPercentage(
                                product.gross_margin_percentage,
                              ),
                          },
                        )}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">
                        {t(
                          "reports.mostProfitableProducts.sales",
                        )}
                      </p>

                      <p className="mt-0.5 font-medium">
                        {formatCurrency(
                          product.total_sales,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">
                        {t(
                          "reports.mostProfitableProducts.cost",
                        )}
                      </p>

                      <p className="mt-0.5 font-medium">
                        {formatCurrency(
                          product.total_cost,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">
                        {t(
                          "reports.mostProfitableProducts.soldLabel",
                        )}
                      </p>

                      <p className="mt-0.5 font-medium">
                        {formatNumber(
                          product.quantity_sold,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}