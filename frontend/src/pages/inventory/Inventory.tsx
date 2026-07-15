import { useState } from "react";

import { useInventoryMovements } from "@/hooks/useInventoryMovements";

import InventoryToolbar from "@/components/inventory/InventoryToolbar";
import InventoryMovementTable from "@/components/inventory/InventoryMovementTable";
import InventoryMovementTableSkeleton from "@/components/inventory/InventoryMovementTableSkeleton";
import InventoryPagination from "@/components/inventory/InventoryPagination";
import InventoryErrorState from "@/components/inventory/InventoryErrorState";
import InventoryMovementDialog from "@/components/inventory/InventoryMovementDialog";
import type { InventoryMovementType } from "@/types/inventory";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function Inventory() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [type, setType] =
    useState<InventoryMovementType | "all">("all");
  const [open, setOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useInventoryMovements({
    page,
    per_page: perPage,
    search: search || undefined,
    type: type === "all" ? undefined : type,
  });

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        <Card className="flex min-h-0 flex-1 flex-col">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
            <InventoryToolbar
              search={search}
              type={type}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              onTypeChange={(value) => {
                setType(value);
                setPage(1);
              }}
              onAddMovement={() => setOpen(true)}
            />

            {isLoading ? (
              <InventoryMovementTableSkeleton />
            ) : isError ? (
              <InventoryErrorState
                onRetry={() => {
                  void refetch();
                }}
              />
            ) : (
              <>
                <InventoryMovementTable
                  movements={data?.data ?? []}
                />

                {data?.meta && (
                  <InventoryPagination
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

      <InventoryMovementDialog
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}