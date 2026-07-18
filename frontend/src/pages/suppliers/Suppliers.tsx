import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import DeactivateSupplierDialog from "@/components/suppliers/DeactivateSupplierDialog";
import SupplierDialog from "@/components/suppliers/SupplierDialog";
import SupplierErrorState from "@/components/suppliers/SupplierErrorState";
import SupplierPagination from "@/components/suppliers/SupplierPagination";
import SupplierTable from "@/components/suppliers/SupplierTable";
import SupplierTableSkeleton from "@/components/suppliers/SupplierTableSkeleton";
import SupplierToolbar from "@/components/suppliers/SupplierToolbar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useDeactivateSupplier } from "@/hooks/useDeactivateSupplier";
import { useSuppliers } from "@/hooks/useSuppliers";
import { getErrorMessage } from "@/lib/error";

import type {
  SupplierStatusFilter,
} from "@/components/suppliers/SupplierToolbar";
import type {
  SortDirection,
  Supplier,
} from "@/types/supplier";

export default function Suppliers() {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] =
    useState(10);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<SupplierStatusFilter>(
      "all",
    );

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [dialogMode, setDialogMode] =
    useState<"create" | "edit">(
      "create",
    );

  const [
    selectedSupplier,
    setSelectedSupplier,
  ] = useState<Supplier | null>(null);

  const [
    deactivateDialogOpen,
    setDeactivateDialogOpen,
  ] = useState(false);

  const [
    supplierToDeactivate,
    setSupplierToDeactivate,
  ] = useState<Supplier | null>(null);

  const isActiveFilter =
    status === "all"
      ? undefined
      : status === "active";

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useSuppliers({
    page,
    per_page: perPage,
    search: search || undefined,
    is_active: isActiveFilter,
    sort_by: "name",
    sort_direction: sortDirection,
  });

  const deactivateSupplierMutation =
    useDeactivateSupplier();

  function openCreateDialog() {
    setDialogMode("create");
    setSelectedSupplier(null);
    setDialogOpen(true);
  }

  function openEditDialog(
    supplier: Supplier,
  ) {
    setDialogMode("edit");
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  }

  function openDeactivateDialog(
    supplier: Supplier,
  ) {
    setSupplierToDeactivate(supplier);
    setDeactivateDialogOpen(true);
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        <Card className="flex min-h-0 flex-1 flex-col">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
            <SupplierToolbar
              search={search}
              status={status}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              onStatusChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              onAddSupplier={
                openCreateDialog
              }
            />

            {isLoading ? (
              <SupplierTableSkeleton />
            ) : isError ? (
              <SupplierErrorState
                onRetry={() => {
                  void refetch();
                }}
              />
            ) : (
              <>
                <SupplierTable
                  suppliers={
                    data?.data ?? []
                  }
                  sortDirection={
                    sortDirection
                  }
                  onSortName={() => {
                    setSortDirection(
                      (current) =>
                        current === "asc"
                          ? "desc"
                          : "asc",
                    );

                    setPage(1);
                  }}
                  onEdit={openEditDialog}
                  onDeactivate={
                    openDeactivateDialog
                  }
                />

                {data?.meta && (
                  <SupplierPagination
                    currentPage={
                      data.meta.current_page
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

      <SupplierDialog
        open={dialogOpen}
        onOpenChange={(value) => {
          setDialogOpen(value);

          if (!value) {
            setSelectedSupplier(null);
          }
        }}
        mode={dialogMode}
        supplier={selectedSupplier}
      />

      <DeactivateSupplierDialog
        open={deactivateDialogOpen}
        onOpenChange={(value) => {
          setDeactivateDialogOpen(
            value,
          );

          if (!value) {
            setSupplierToDeactivate(
              null,
            );
          }
        }}
        supplier={supplierToDeactivate}
        loading={
          deactivateSupplierMutation.isPending
        }
        onConfirm={() => {
          if (!supplierToDeactivate) {
            return;
          }

          deactivateSupplierMutation.mutate(
            supplierToDeactivate.id,
            {
              onSuccess: () => {
                toast.success(
                  t(
                    "suppliers.toast.deactivated",
                  ),
                );

                setDeactivateDialogOpen(
                  false,
                );

                setSupplierToDeactivate(
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
        }}
      />
    </>
  );
}