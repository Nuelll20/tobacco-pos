import { useMemo, useState } from "react";

import { useProducts } from "@/hooks/useProducts";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";

import type { Product } from "@/types/product";

import DeleteProductDialog from "@/components/products/DeleteProductDialog";
import ProductToolbar from "@/components/products/ProductToolbar";
import ProductTable from "@/components/products/ProductTable";
import ProductDialog from "@/components/products/ProductDialog";
import ProductTableSkeleton from "@/components/products/ProductTableSkeleton";
import ProductPagination from "@/components/products/ProductPagination";

import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function Products() {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [mode, setMode] =
    useState<"create" | "edit">("create");

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [productToDelete, setProductToDelete] =
    useState<Product | null>(null);

  const { data, isLoading, isError } = useProducts({
    page,
    per_page: perPage,
  });

  const deleteProductMutation = useDeleteProduct();

  const products = useMemo(() => {
    const items = data?.data ?? [];

    return items.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.sku
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [data, search]);

  if (isError) {
    return <p>Failed to load products.</p>;
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        <Card className="flex min-h-0 flex-1 flex-col">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
            <ProductToolbar
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              onAddProduct={() => {
                setMode("create");
                setSelectedProduct(null);
                setOpen(true);
              }}
            />

            {isLoading ? (
              <ProductTableSkeleton />
            ) : (
              <>
                <ProductTable
                  products={products}
                  onEdit={(product) => {
                    setSelectedProduct(product);
                    setMode("edit");
                    setOpen(true);
                  }}
                  onDelete={(product) => {
                    setProductToDelete(product);
                    setDeleteOpen(true);
                  }}
                />

                {data?.meta && (
                  <ProductPagination
                    currentPage={data.meta.current_page}
                    lastPage={data.meta.last_page}
                    total={data.meta.total}
                    perPage={data.meta.per_page}
                    onPageChange={setPage}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <ProductDialog
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        product={selectedProduct}
      />

      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={productToDelete}
        loading={deleteProductMutation.isPending}
        onConfirm={() => {
          if (!productToDelete) return;

          deleteProductMutation.mutate(productToDelete.id, {
            onSuccess: () => {
              toast.success("Product deleted successfully.");

              setDeleteOpen(false);
              setProductToDelete(null);
            },

            onError: (error) => {
              toast.error(getErrorMessage(error));
            },
          });
        }}
      />
    </>
  );
}