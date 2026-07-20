import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createStockOpname,
} from "@/services/stock-opname.service";

import type {
  StockOpnamePayload,
} from "@/types/stock-opname";

export function useCreateStockOpname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: StockOpnamePayload,
    ) => createStockOpname(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-opnames"],
      });
    },
  });
}