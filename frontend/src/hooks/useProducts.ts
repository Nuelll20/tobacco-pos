import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/product.service";
import type { ProductQueryParams } from "@/types/product";

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
}