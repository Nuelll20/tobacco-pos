import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import StockOpnameActionDialog from "@/components/stock-opnames/StockOpnameActionDialog";
import StockOpnameCreateDialog from "@/components/stock-opnames/StockOpnameCreateDialog";
import StockOpnameDetailDialog from "@/components/stock-opnames/StockOpnameDetailDialog";
import StockOpnameEditDialog from "@/components/stock-opnames/StockOpnameEditDialog";
import StockOpnameErrorState from "@/components/stock-opnames/StockOpnameErrorState";
import StockOpnamePagination from "@/components/stock-opnames/StockOpnamePagination";
import StockOpnameTable from "@/components/stock-opnames/StockOpnameTable";
import StockOpnameTableSkeleton from "@/components/stock-opnames/StockOpnameTableSkeleton";
import StockOpnameToolbar from "@/components/stock-opnames/StockOpnameToolbar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useCancelStockOpname } from "@/hooks/useCancelStockOpname";
import { useFinalizeStockOpname } from "@/hooks/useFinalizeStockOpname";
import { useStockOpnames } from "@/hooks/useStockOpnames";
import { getErrorMessage } from "@/lib/error";

import type {
  StockOpname,
  StockOpnameStatus,
} from "@/types/stock-opname";

type StockOpnameAction =
  | "finalize"
  | "cancel";

export default function StockOpnames() {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] =
    useState(10);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<
      StockOpnameStatus | "all"
    >("all");

  const [dateFrom, setDateFrom] =
    useState("");

  const [dateTo, setDateTo] =
    useState("");

  const [createOpen, setCreateOpen] =
    useState(false);

  const [
    detailStockOpnameId,
    setDetailStockOpnameId,
  ] = useState<number | null>(null);

  const [
    editStockOpnameId,
    setEditStockOpnameId,
  ] = useState<number | null>(null);

  const [
    action,
    setAction,
  ] = useState<
    StockOpnameAction | null
  >(null);

  const [
    actionStockOpname,
    setActionStockOpname,
  ] = useState<StockOpname | null>(
    null,
  );

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useStockOpnames({
    page,
    per_page: perPage,
    search:
      search || undefined,
    status:
      status === "all"
        ? undefined
        : status,
    date_from:
      dateFrom || undefined,
    date_to:
      dateTo || undefined,
  });

  const finalizeMutation =
    useFinalizeStockOpname();

  const cancelMutation =
    useCancelStockOpname();

  const hasActiveFilters =
    search !== "" ||
    status !== "all" ||
    dateFrom !== "" ||
    dateTo !== "";

  const isActionPending =
    finalizeMutation.isPending ||
    cancelMutation.isPending;

  function handleResetFilters() {
    setSearch("");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  function handleDateFromChange(
    value: string,
  ) {
    setDateFrom(value);

    if (
      value &&
      dateTo &&
      dateTo < value
    ) {
      setDateTo("");
    }

    setPage(1);
  }

  function handleOpenAction(
    nextAction: StockOpnameAction,
    stockOpname: StockOpname,
  ) {
    setAction(nextAction);
    setActionStockOpname(
      stockOpname,
    );
  }

  function handleCloseAction() {
    if (isActionPending) {
      return;
    }

    setAction(null);
    setActionStockOpname(null);
  }

  function handleConfirmAction() {
    if (
      action === null ||
      actionStockOpname === null
    ) {
      return;
    }

    if (action === "finalize") {
      finalizeMutation.mutate(
        actionStockOpname.id,
        {
          onSuccess: () => {
            toast.success(
              t(
                "stockOpnames.toast.finalized",
              ),
            );

            setAction(null);
            setActionStockOpname(
              null,
            );
          },

          onError: (error) => {
            toast.error(
              getErrorMessage(error),
            );
          },
        },
      );

      return;
    }

    cancelMutation.mutate(
      actionStockOpname.id,
      {
        onSuccess: () => {
          toast.success(
            t(
              "stockOpnames.toast.cancelled",
            ),
          );

          setAction(null);
          setActionStockOpname(
            null,
          );
        },

        onError: (error) => {
          toast.error(
            getErrorMessage(error),
          );
        },
      },
    );
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        <Card className="flex min-h-0 flex-1 flex-col">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
            <StockOpnameToolbar
              search={search}
              status={status}
              dateFrom={dateFrom}
              dateTo={dateTo}
              hasActiveFilters={
                hasActiveFilters
              }
              onSearchChange={(
                value,
              ) => {
                setSearch(value);
                setPage(1);
              }}
              onStatusChange={(
                value,
              ) => {
                setStatus(value);
                setPage(1);
              }}
              onDateFromChange={
                handleDateFromChange
              }
              onDateToChange={(
                value,
              ) => {
                setDateTo(value);
                setPage(1);
              }}
              onResetFilters={
                handleResetFilters
              }
              onCreate={() =>
                setCreateOpen(true)
              }
            />

            {isLoading ? (
              <StockOpnameTableSkeleton />
            ) : isError ? (
              <StockOpnameErrorState
                onRetry={() => {
                  void refetch();
                }}
              />
            ) : (
              <>
                <StockOpnameTable
                  stockOpnames={
                    data?.data ?? []
                  }
                  isFinalizing={
                    finalizeMutation.isPending
                  }
                  isCancelling={
                    cancelMutation.isPending
                  }
                  onView={(
                    stockOpname,
                  ) =>
                    setDetailStockOpnameId(
                      stockOpname.id,
                    )
                  }
                  onEdit={(
                    stockOpname,
                  ) =>
                    setEditStockOpnameId(
                      stockOpname.id,
                    )
                  }
                  onFinalize={(
                    stockOpname,
                  ) =>
                    handleOpenAction(
                      "finalize",
                      stockOpname,
                    )
                  }
                  onCancel={(
                    stockOpname,
                  ) =>
                    handleOpenAction(
                      "cancel",
                      stockOpname,
                    )
                  }
                />

                {data?.meta && (
                  <StockOpnamePagination
                    currentPage={
                      data.meta
                        .current_page
                    }
                    lastPage={
                      data.meta.last_page
                    }
                    total={
                      data.meta.total
                    }
                    perPage={
                      data.meta.per_page
                    }
                    onPageChange={
                      setPage
                    }
                    onPerPageChange={(
                      value,
                    ) => {
                      setPerPage(value);
                      setPage(1);
                    }}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <StockOpnameCreateDialog
        open={createOpen}
        onOpenChange={
          setCreateOpen
        }
      />

      <StockOpnameEditDialog
        stockOpnameId={
          editStockOpnameId
        }
        open={
          editStockOpnameId !==
          null
        }
        onOpenChange={(
          open,
        ) => {
          if (!open) {
            setEditStockOpnameId(
              null,
            );
          }
        }}
      />

      <StockOpnameDetailDialog
        stockOpnameId={
          detailStockOpnameId
        }
        open={
          detailStockOpnameId !==
          null
        }
        onOpenChange={(
          open,
        ) => {
          if (!open) {
            setDetailStockOpnameId(
              null,
            );
          }
        }}
      />

      <StockOpnameActionDialog
        action={
          action ?? "finalize"
        }
        stockOpname={
          actionStockOpname
        }
        open={
          action !== null &&
          actionStockOpname !== null
        }
        isPending={
          isActionPending
        }
        onOpenChange={(
          open,
        ) => {
          if (!open) {
            handleCloseAction();
          }
        }}
        onConfirm={
          handleConfirmAction
        }
      />
    </>
  );
}