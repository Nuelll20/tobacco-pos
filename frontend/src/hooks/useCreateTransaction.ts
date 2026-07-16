import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTransaction } from "@/services/transaction.service";

import type { TransactionPayload } from "@/types/transaction";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TransactionPayload) =>
      createTransaction(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory-movements"],
      });
    },
  });
}