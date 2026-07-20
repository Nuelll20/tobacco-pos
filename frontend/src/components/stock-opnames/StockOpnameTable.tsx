import {
  CheckCircle2,
  Eye,
  Pencil,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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

import type {
  StockOpname,
  StockOpnameStatus,
} from "@/types/stock-opname";

interface StockOpnameTableProps {
  stockOpnames: StockOpname[];
  isFinalizing?: boolean;
  isCancelling?: boolean;
  onView: (
    stockOpname: StockOpname,
  ) => void;
  onEdit: (
    stockOpname: StockOpname,
  ) => void;
  onFinalize: (
    stockOpname: StockOpname,
  ) => void;
  onCancel: (
    stockOpname: StockOpname,
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

export default function StockOpnameTable({
  stockOpnames,
  isFinalizing = false,
  isCancelling = false,
  onView,
  onEdit,
  onFinalize,
  onCancel,
}: StockOpnameTableProps) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en"
      ? "en-US"
      : "id-ID";

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

  function formatNumber(
    value: number,
  ) {
    return new Intl.NumberFormat(
      locale,
    ).format(value);
  }

  return (
    <div className="min-h-0 flex-1 rounded-md border">
      <div className="h-full overflow-auto">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "stockOpnames.table.opnameNo",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "stockOpnames.table.countedAt",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "stockOpnames.table.status",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background text-right">
                {t(
                  "stockOpnames.table.itemsCount",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background">
                {t(
                  "stockOpnames.table.note",
                )}
              </TableHead>

              <TableHead className="sticky top-0 z-10 bg-background text-right">
                {t(
                  "stockOpnames.table.actions",
                )}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {stockOpnames.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  {t(
                    "stockOpnames.table.empty",
                  )}
                </TableCell>
              </TableRow>
            ) : (
              stockOpnames.map(
                (stockOpname) => (
                  <TableRow
                    key={stockOpname.id}
                  >
                    <TableCell className="whitespace-nowrap font-medium">
                      {
                        stockOpname.opname_no
                      }
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDate(
                        stockOpname.counted_at,
                      )}
                    </TableCell>

                    <TableCell>
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
                    </TableCell>

                    <TableCell className="text-right">
                      {formatNumber(
                        stockOpname.items_count ??
                          0,
                      )}
                    </TableCell>

                    <TableCell
                      className="max-w-[280px] truncate"
                      title={
                        stockOpname.note ||
                        undefined
                      }
                    >
                      {stockOpname.note ||
                        "-"}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={t(
                            "stockOpnames.actions.view",
                          )}
                          title={t(
                            "stockOpnames.actions.view",
                          )}
                          onClick={() =>
                            onView(
                              stockOpname,
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {stockOpname.status ===
                          "draft" && (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={t(
                                "stockOpnames.actions.edit",
                              )}
                              title={t(
                                "stockOpnames.actions.edit",
                              )}
                              disabled={
                                isFinalizing ||
                                isCancelling
                              }
                              onClick={() =>
                                onEdit(
                                  stockOpname,
                                )
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={t(
                                "stockOpnames.actions.finalize",
                              )}
                              title={t(
                                "stockOpnames.actions.finalize",
                              )}
                              disabled={
                                isFinalizing ||
                                isCancelling
                              }
                              onClick={() =>
                                onFinalize(
                                  stockOpname,
                                )
                              }
                            >
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={t(
                                "stockOpnames.actions.cancel",
                              )}
                              title={t(
                                "stockOpnames.actions.cancel",
                              )}
                              disabled={
                                isFinalizing ||
                                isCancelling
                              }
                              onClick={() =>
                                onCancel(
                                  stockOpname,
                                )
                              }
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}