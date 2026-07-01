import { useMemo, useState } from "react";

import { useProducts } from "@/hooks/useProducts";

import ProductToolbar from "@/components/products/ProductToolbar";
import ProductTable from "@/components/products/ProductTable";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Products() {
  const { data, isLoading, isError } = useProducts();

  const [search, setSearch] = useState("");

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
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <ProductToolbar
          search={search}
          onSearchChange={setSearch}
        />

        <ProductTable products={products} />
      </CardContent>
    </Card>
  );
}