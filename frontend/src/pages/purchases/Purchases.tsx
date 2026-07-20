import {
  useState,
} from "react";

import PurchaseActionDialog from "@/components/purchases/PurchaseActionDialog";
import type {
  PurchaseAction,
} from "@/components/purchases/PurchaseActionDialog";
import PurchaseDetailDialog from "@/components/purchases/PurchaseDetailDialog";
import PurchaseDialog from "@/components/purchases/PurchaseDialog";
import PurchaseErrorState from "@/components/purchases/PurchaseErrorState";
import PurchasePagination from "@/components/purchases/PurchasePagination";
import PurchaseTable from "@/components/purchases/PurchaseTable";
import PurchaseTableSkeleton from "@/components/purchases/PurchaseTableSkeleton";
import PurchaseToolbar from "@/components/purchases/PurchaseToolbar";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  usePurchases,
} from "@/hooks/usePurchases";

import type {
  Purchase,
  PurchasePaymentStatus,
  PurchaseReceiptStatus,
} from "@/types/purchase";

export default function Purchases() {
  const [page, setPage] =
    useState(1);

  const [perPage, setPerPage] =
    useState(10);

  const [search, setSearch] =
    useState("");

  const [
    supplierId,
    setSupplierId,
  ] = useState<number | "all">(
    "all",
  );

  const [
    receiptStatus,
    setReceiptStatus,
  ] = useState<
    PurchaseReceiptStatus | "all"
  >("all");

  const [
    paymentStatus,
    setPaymentStatus,
  ] = useState<
    PurchasePaymentStatus | "all"
  >("all");

  const [dateFrom, setDateFrom] =
    useState("");

  const [dateTo, setDateTo] =
    useState("");

  const [
    isPurchaseDialogOpen,
    setIsPurchaseDialogOpen,
  ] = useState(false);

  const [
    editingPurchaseId,
    setEditingPurchaseId,
  ] = useState<number | null>(
    null,
  );

  const [
    selectedPurchaseId,
    setSelectedPurchaseId,
  ] = useState<number | null>(
    null,
  );

  const [
    actionPurchase,
    setActionPurchase,
  ] = useState<Purchase | null>(
    null,
  );

  const [
    purchaseAction,
    setPurchaseAction,
  ] = useState<
    PurchaseAction | null
  >(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = usePurchases({
    page,
    per_page: perPage,

    search:
      search.trim() || undefined,

    supplier_id:
      supplierId === "all"
        ? undefined
        : supplierId,

    receipt_status:
      receiptStatus === "all"
        ? undefined
        : receiptStatus,

    payment_status:
      paymentStatus === "all"
        ? undefined
        : paymentStatus,

    date_from:
      dateFrom || undefined,

    date_to:
      dateTo || undefined,
  });

  const hasActiveFilters =
    search !== "" ||
    supplierId !== "all" ||
    receiptStatus !== "all" ||
    paymentStatus !== "all" ||
    dateFrom !== "" ||
    dateTo !== "";

  function resetPage() {
    setPage(1);
  }

  function handleResetFilters() {
    setSearch("");
    setSupplierId("all");
    setReceiptStatus("all");
    setPaymentStatus("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  function handleAddPurchase() {
    setEditingPurchaseId(null);
    setIsPurchaseDialogOpen(true);
  }

  function handleEditPurchase(
    purchase: Purchase,
  ) {
    setEditingPurchaseId(
      purchase.id,
    );

    setIsPurchaseDialogOpen(true);
  }

  function handleViewPurchase(
    purchase: Purchase,
  ) {
    setSelectedPurchaseId(
      purchase.id,
    );
  }

  function handlePurchaseAction(
    purchase: Purchase,
    action: PurchaseAction,
  ) {
    setActionPurchase(purchase);
    setPurchaseAction(action);
  }

  function closeActionDialog() {
    setActionPurchase(null);
    setPurchaseAction(null);
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        <Card className="flex min-h-0 flex-1 flex-col">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
            <PurchaseToolbar
              search={search}
              supplierId={supplierId}
              receiptStatus={
                receiptStatus
              }
              paymentStatus={
                paymentStatus
              }
              dateFrom={dateFrom}
              dateTo={dateTo}
              hasActiveFilters={
                hasActiveFilters
              }
              onSearchChange={(
                value,
              ) => {
                setSearch(value);
                resetPage();
              }}
              onSupplierIdChange={(
                value,
              ) => {
                setSupplierId(value);
                resetPage();
              }}
              onReceiptStatusChange={(
                value,
              ) => {
                setReceiptStatus(value);
                resetPage();
              }}
              onPaymentStatusChange={(
                value,
              ) => {
                setPaymentStatus(value);
                resetPage();
              }}
              onDateFromChange={(
                value,
              ) => {
                setDateFrom(value);

                if (
                  dateTo &&
                  value &&
                  dateTo < value
                ) {
                  setDateTo(value);
                }

                resetPage();
              }}
              onDateToChange={(
                value,
              ) => {
                setDateTo(value);
                resetPage();
              }}
              onResetFilters={
                handleResetFilters
              }
              onAddPurchase={
                handleAddPurchase
              }
            />

            {isLoading ? (
              <PurchaseTableSkeleton />
            ) : isError ? (
              <PurchaseErrorState
                onRetry={() => {
                  void refetch();
                }}
              />
            ) : (
              <>
                <PurchaseTable
                  purchases={
                    data?.data ?? []
                  }
                  onView={
                    handleViewPurchase
                  }
                  onEdit={
                    handleEditPurchase
                  }
                  onReceive={(
                    purchase,
                  ) =>
                    handlePurchaseAction(
                      purchase,
                      "receive",
                    )
                  }
                  onCancel={(
                    purchase,
                  ) =>
                    handlePurchaseAction(
                      purchase,
                      "cancel",
                    )
                  }
                />

                {data?.meta && (
                  <PurchasePagination
                    currentPage={
                      data.meta
                        .current_page
                    }
                    lastPage={
                      data.meta
                        .last_page
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

      <PurchaseDialog
        open={
          isPurchaseDialogOpen
        }
        purchaseId={
          editingPurchaseId
        }
        onOpenChange={(
          open,
        ) => {
          setIsPurchaseDialogOpen(
            open,
          );

          if (!open) {
            setEditingPurchaseId(
              null,
            );
          }
        }}
      />

      <PurchaseDetailDialog
        open={
          selectedPurchaseId !==
          null
        }
        purchaseId={
          selectedPurchaseId
        }
        onOpenChange={(
          open,
        ) => {
          if (!open) {
            setSelectedPurchaseId(
              null,
            );
          }
        }}
      />

      <PurchaseActionDialog
        open={
          actionPurchase !== null &&
          purchaseAction !== null
        }
        action={purchaseAction}
        purchase={actionPurchase}
        onOpenChange={(
          open,
        ) => {
          if (!open) {
            closeActionDialog();
          }
        }}
        onSuccess={
          closeActionDialog
        }
      />
    </>
  );
}