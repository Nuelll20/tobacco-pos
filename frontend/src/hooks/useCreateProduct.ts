import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProduct } from "@/services/product.service";
import type { ProductPayload } from "@/types/product";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductPayload) =>
      createProduct(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}