import {
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
  SalesReportTopProduct,
} from "@/types/sales-report";

type SalesReportTopProductsProps = {
  products: SalesReportTopProduct[];
};

export default function SalesReportTopProducts({
  products,
}: SalesReportTopProductsProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("reports.topProducts.title")}
        </CardTitle>

        <CardDescription>
          {t(
            "reports.topProducts.description",
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {products.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed px-4 text-center">
            <PackageSearch className="mb-3 size-8 text-muted-foreground" />

            <p className="text-sm font-medium">
              {t(
                "reports.topProducts.emptyTitle",
              )}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {t(
                "reports.topProducts.emptyDescription",
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
                  className="flex items-center justify-between gap-4 rounded-md border p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted font-semibold">
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
                          "reports.topProducts.sku",
                          {
                            sku:
                              product.product_sku,
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <Badge variant="secondary">
                      {t(
                        "reports.topProducts.sold",
                        {
                          count:
                            formatNumber(
                              product.quantity_sold,
                            ),
                        },
                      )}
                    </Badge>

                    <p className="mt-1 text-sm font-semibold">
                      {formatCurrency(
                        product.total_sales,
                      )}
                    </p>
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