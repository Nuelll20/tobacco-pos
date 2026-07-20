import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  receivePurchase,
} from "@/services/purchase.service";

export function useReceivePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      purchaseId: number,
    ) => receivePurchase(purchaseId),

    onSuccess: (_, purchaseId) => {
      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "purchases",
          "detail",
          purchaseId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "inventory-movements",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}