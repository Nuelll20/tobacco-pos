import { useMemo, useState } from "react";

import { useProducts } from "@/hooks/useProducts";

import type { Product } from "@/types/product";

import DeleteProductDialog from "@/components/products/DeleteProductDialog";
import ProductToolbar from "@/components/products/ProductToolbar";
import ProductTable from "@/components/products/ProductTable";
import ProductDialog from "@/components/products/ProductDialog";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function Products() {
  const { data, isLoading, isError } = useProducts();

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [mode, setMode] =
    useState<"create" | "edit">("create");

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [productToDelete, setProductToDelete] =
    useState<Product | null>(null);

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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Failed to load products.</p>;
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        <Card className="flex min-h-0 flex-1 flex-col">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-6 p-6">
            <ProductToolbar
              search={search}
              onSearchChange={setSearch}
              onAddProduct={() => {
                setMode("create");
                setSelectedProduct(null);
                setOpen(true);
              }}
            />

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