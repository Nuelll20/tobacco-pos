import { useState } from "react";

import { useTransactions } from "@/hooks/useTransactions";

import TransactionDetailDialog from "@/components/transactions/TransactionDetailDialog";
import TransactionDialog from "@/components/transactions/TransactionDialog";
import TransactionErrorState from "@/components/transactions/TransactionErrorState";
import TransactionPagination from "@/components/transactions/TransactionPagination";
import TransactionTable from "@/components/transactions/TransactionTable";
import TransactionTableSkeleton from "@/components/transactions/TransactionTableSkeleton";
import TransactionToolbar from "@/components/transactions/TransactionToolbar";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type {
  PaymentMethod,
  Transaction,
} from "@/types/transaction";

export default function Transactions() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | "all">("all");

  const [isCreateDialogOpen, setIsCreateDialogOpen] =
    useState(false);

  const [selectedTransactionId, setSelectedTransactionId] =
    useState<number | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useTransactions({
    page,
    per_page: perPage,
    search: search || undefined,
    payment_method:
      paymentMethod === "all"
        ? undefined
        : paymentMethod,
  });

  const hasActiveFilters =
    search !== "" || paymentMethod !== "all";

  const handleResetFilters = () => {
    setSearch("");
    setPaymentMethod("all");
    setPage(1);
  };

  const handleViewTransaction = (
    transaction: Transaction
  ) => {
    setSelectedTransactionId(transaction.id);
  };

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        <Card className="flex min-h-0 flex-1 flex-col">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
            <TransactionToolbar
              search={search}
              paymentMethod={paymentMethod}
              hasActiveFilters={hasActiveFilters}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              onPaymentMethodChange={(value) => {
                setPaymentMethod(value);
                setPage(1);
              }}
              onResetFilters={handleResetFilters}
              onAddTransaction={() =>
                setIsCreateDialogOpen(true)
              }
            />

            {isLoading ? (
              <TransactionTableSkeleton />
            ) : isError ? (
              <TransactionErrorState
                onRetry={() => {
                  void refetch();
                }}
              />
            ) : (
              <>
                <TransactionTable
                  transactions={data?.data ?? []}
                  onView={handleViewTransaction}
                />

                {data?.meta && (
                  <TransactionPagination
                    currentPage={data.meta.current_page}
                    lastPage={data.meta.last_page}
                    total={data.meta.total}
                    perPage={data.meta.per_page}
                    onPageChange={setPage}
                    onPerPageChange={(value) => {
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

      <TransactionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <TransactionDetailDialog
        open={selectedTransactionId !== null}
        transactionId={selectedTransactionId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTransactionId(null);
          }
        }}
      />
    </>
  );
}
