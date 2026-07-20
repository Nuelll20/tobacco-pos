import {
  AlertTriangle,
  Bell,
  LoaderCircle,
  PackageX,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useLowStockNotifications } from "@/hooks/useLowStockNotifications";

export default function LowStockNotificationMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useLowStockNotifications();

  const notification = data?.data;
  const count = notification?.count ?? 0;

  const badgeLabel =
    count > 99
      ? "99+"
      : count.toString();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={t(
            "lowStockNotifications.trigger",
            { count },
          )}
        >
          <Bell className="h-5 w-5" />

          {count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]"
            >
              {badgeLabel}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-2rem)] max-w-sm p-0"
      >
        <div className="flex items-start justify-between gap-4 p-4">
          <div>
            <h3 className="font-semibold">
              {t(
                "lowStockNotifications.title",
              )}
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {t(
                "lowStockNotifications.description",
                { count },
              )}
            </p>
          </div>

          {isFetching && !isLoading && (
            <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <Separator />

        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex min-h-40 flex-col items-center justify-center p-6 text-center">
              <LoaderCircle className="mb-3 h-6 w-6 animate-spin text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                {t(
                  "lowStockNotifications.loading",
                )}
              </p>
            </div>
          ) : isError ? (
            <div className="flex min-h-40 flex-col items-center justify-center p-6 text-center">
              <AlertTriangle className="mb-3 h-7 w-7 text-destructive" />

              <p className="text-sm font-medium">
                {t(
                  "lowStockNotifications.error.title",
                )}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {t(
                  "lowStockNotifications.error.description",
                )}
              </p>

              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  void refetch();
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />

                {t(
                  "lowStockNotifications.actions.retry",
                )}
              </Button>
            </div>
          ) : notification &&
            notification.items.length > 0 ? (
            <div className="divide-y">
              {notification.items.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                      {item.is_out_of_stock ? (
                        <PackageX className="h-4 w-4 text-destructive" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p
                            className="truncate text-sm font-medium"
                            title={item.name}
                          >
                            {item.name}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.sku}
                          </p>
                        </div>

                        <Badge
                          variant={
                            item.is_out_of_stock
                              ? "destructive"
                              : "secondary"
                          }
                          className="shrink-0"
                        >
                          {item.is_out_of_stock
                            ? t(
                                "lowStockNotifications.statuses.outOfStock",
                              )
                            : t(
                                "lowStockNotifications.statuses.lowStock",
                              )}
                        </Badge>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {t(
                          "lowStockNotifications.stockSummary",
                          {
                            stock:
                              item.stock,
                            minimum:
                              item.minimum_stock,
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="flex min-h-40 flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>

              <p className="text-sm font-medium">
                {t(
                  "lowStockNotifications.empty.title",
                )}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {t(
                  "lowStockNotifications.empty.description",
                )}
              </p>
            </div>
          )}
        </div>

        {notification &&
          notification.items.length > 0 && (
            <>
              <Separator />

              <div className="p-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-center"
                  onClick={() =>
                    navigate("/products")
                  }
                >
                  {notification.has_more
                    ? t(
                        "lowStockNotifications.actions.viewAll",
                        {
                          count:
                            notification.count,
                        },
                      )
                    : t(
                        "lowStockNotifications.actions.viewProducts",
                      )}
                </Button>
              </div>
            </>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}