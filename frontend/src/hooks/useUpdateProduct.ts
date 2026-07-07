import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProduct } from "@/services/product.service";
import type { ProductPayload } from "@/types/product";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: ProductPayload;
    }) => updateProduct(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}