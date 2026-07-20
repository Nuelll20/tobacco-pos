import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  lowStockNotificationQueryKey,
} from "@/hooks/useLowStockNotifications";
import {
  createProduct,
} from "@/services/product.service";

import type {
  ProductPayload,
} from "@/types/product";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: ProductPayload,
    ) => createProduct(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey:
          lowStockNotificationQueryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}