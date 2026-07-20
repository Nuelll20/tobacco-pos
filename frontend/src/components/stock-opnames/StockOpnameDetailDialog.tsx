import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStockOpname } from "@/hooks/useStockOpname";

import type {
  StockOpnameStatus,
} from "@/types/stock-opname";

interface StockOpnameDetailDialogProps {
  stockOpnameId: number | null;
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
}

const statusLabelKeys: Record<
  StockOpnameStatus,
  string
> = {
  draft:
    "stockOpnames.statuses.draft",
  finalized:
    "stockOpnames.statuses.finalized",
  cancelled:
    "stockOpnames.statuses.cancelled",
};

const statusClassNames: Record<
  StockOpnameStatus,
  string
> = {
  draft:
    "bg-amber-100 text-amber-700",
  finalized:
    "bg-emerald-100 text-emerald-700",
  cancelled:
    "bg-slate-100 text-slate-700",
};

export default function StockOpnameDetailDialog({
  stockOpnameId,
  open,
  onOpenChange,
}: StockOpnameDetailDialogProps) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useStockOpname(
    open
      ? stockOpnameId
      : null,
  );

  const stockOpname =
    data?.data;

  function formatNumber(
    value: number,
  ) {
    return new Intl.NumberFormat(
      locale,
    ).format(value);
  }

  function formatDate(
    value: string,
  ) {
    const date = new Date(
      `${value}T00:00:00`,
    );

    if (
      Number.isNaN(date.getTime())
    ) {
      return "-";
    }

    return new Intl.DateTimeFormat(
      locale,
      {
        dateStyle: "medium",
      },
    ).format(date);
  }

  function formatDateTime(
    value: string | null,
  ) {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (
      Number.isNaN(date.getTime())
    ) {
      return "-";
    }

    return new Intl.DateTimeFormat(
      locale,
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(date);
  }

  function formatDifference(
    value: number,
  ) {
    if (value > 0) {
      return `+${formatNumber(value)}`;
    }

    return formatNumber(value);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            {t(
              "stockOpnames.detailDialog.title",
            )}
          </DialogTitle>

          <DialogDescription>
            {t(
              "stockOpnames.detailDialog.description",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
              {t(
                "stockOpnames.detailDialog.loading",
              )}
            </div>
          ) : isError ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-destructive">
                {t(
                  "stockOpnames.detailDialog.loadError",
                )}
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void refetch();
                }}
              >
                {t(
                  "stockOpnames.actions.retry",
                )}
              </Button>
            </div>
          ) : stockOpname ? (
            <div className="space-y-6">
              <div className="grid gap-4 rounded-md border p-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "stockOpnames.detail.opnameNo",
                    )}
                  </p>

                  <p className="mt-1 font-semibold">
                    {stockOpname.opname_no}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "stockOpnames.detail.status",
                    )}
                  </p>

                  <div className="mt-1">
                    <Badge
                      className={
                        statusClassNames[
                          stockOpname.status
                        ]
                      }
                    >
                      {t(
                        statusLabelKeys[
                          stockOpname.status
                        ],
                      )}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "stockOpnames.detail.countedAt",
                    )}
                  </p>

                  <p className="mt-1 font-medium">
                    {formatDate(
                      stockOpname.counted_at,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "stockOpnames.detail.finalizedAt",
                    )}
                  </p>

                  <p className="mt-1 font-medium">
                    {formatDateTime(
                      stockOpname.finalized_at,
                    )}
                  </p>
                </div>

                <div className="sm:col-span-2 lg:col-span-4">
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "stockOpnames.detail.note",
                    )}
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm">
                    {stockOpname.note ||
                      "-"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">
                    {t(
                      "stockOpnames.detail.itemsTitle",
                    )}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {t(
                      "stockOpnames.detail.itemsDescription",
                      {
                        count:
                          stockOpname.items_count ??
                          stockOpname.items
                            ?.length ??
                          0,
                      },
                    )}
                  </p>
                </div>

                <div className="overflow-x-auto rounded-md border">
                  <Table className="min-w-[900px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t(
                            "stockOpnames.table.product",
                          )}
                        </TableHead>

                        <TableHead>
                          {t(
                            "stockOpnames.table.sku",
                          )}
                        </TableHead>

                        <TableHead className="text-right">
                          {t(
                            "stockOpnames.table.systemStock",
                          )}
                        </TableHead>

                        <TableHead className="text-right">
                          {t(
                            "stockOpnames.table.countedStock",
                          )}
                        </TableHead>

                        <TableHead className="text-right">
                          {t(
                            "stockOpnames.table.difference",
                          )}
                        </TableHead>

                        <TableHead>
                          {t(
                            "stockOpnames.table.note",
                          )}
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {(
                        stockOpname.items ??
                        []
                      ).map((item) => (
                        <TableRow
                          key={item.id}
                        >
                          <TableCell className="font-medium">
                            {
                              item.product_name
                            }
                          </TableCell>

                          <TableCell>
                            {
                              item.product_sku
                            }
                          </TableCell>

                          <TableCell className="text-right">
                            {formatNumber(
                              item.system_stock,
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            {formatNumber(
                              item.counted_stock,
                            )}
                          </TableCell>

                          <TableCell
                            className={
                              item.difference >
                              0
                                ? "text-right font-semibold text-emerald-600"
                                : item.difference <
                                    0
                                  ? "text-right font-semibold text-destructive"
                                  : "text-right font-semibold"
                            }
                          >
                            {formatDifference(
                              item.difference,
                            )}
                          </TableCell>

                          <TableCell
                            className="max-w-[260px] truncate"
                            title={
                              item.note ||
                              undefined
                            }
                          >
                            {item.note ||
                              "-"}
                          </TableCell>
                        </TableRow>
                      ))}

                      {(
                        stockOpname.items ??
                        []
                      ).length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-28 text-center text-muted-foreground"
                          >
                            {t(
                              "stockOpnames.table.emptyItems",
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}