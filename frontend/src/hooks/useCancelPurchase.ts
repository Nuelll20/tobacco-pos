import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  cancelPurchase,
} from "@/services/purchase.service";

export function useCancelPurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      purchaseId: number,
    ) => cancelPurchase(purchaseId),

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
    },
  });
}