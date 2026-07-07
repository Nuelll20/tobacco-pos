import { useMemo, useState } from "react";

import { useProducts } from "@/hooks/useProducts";

import type { Product } from "@/types/product";

import ProductToolbar from "@/components/products/ProductToolbar";
import ProductTable from "@/components/products/ProductTable";
import ProductDialog from "@/components/products/ProductDialog";

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
      <Card>
        <CardContent className="space-y-6">
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
          />
        </CardContent>
      </Card>

      <ProductDialog
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        product={selectedProduct}
      />
    </>
  );
}