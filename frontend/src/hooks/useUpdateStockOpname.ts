import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateStockOpname,
} from "@/services/stock-opname.service";

import type {
  StockOpnamePayload,
} from "@/types/stock-opname";

interface UpdateStockOpnameVariables {
  id: number;
  payload: StockOpnamePayload;
}

export function useUpdateStockOpname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdateStockOpnameVariables) =>
      updateStockOpname(
        id,
        payload,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["stock-opnames"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "stock-opname",
          variables.id,
        ],
      });
    },
  });
}