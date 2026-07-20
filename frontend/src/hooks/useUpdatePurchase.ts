import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updatePurchase,
} from "@/services/purchase.service";

import type {
  PurchasePayload,
} from "@/types/purchase";

type UpdatePurchaseVariables = {
  id: number;
  payload: PurchasePayload;
};

export function useUpdatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdatePurchaseVariables) =>
      updatePurchase(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "purchases",
          "detail",
          variables.id,
        ],
      });
    },
  });
}