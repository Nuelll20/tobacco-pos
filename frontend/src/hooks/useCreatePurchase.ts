import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPurchase,
} from "@/services/purchase.service";

import type {
  PurchasePayload,
} from "@/types/purchase";

export function useCreatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: PurchasePayload,
    ) => createPurchase(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });
    },
  });
}