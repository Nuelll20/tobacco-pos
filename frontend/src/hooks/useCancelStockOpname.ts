import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  cancelStockOpname,
} from "@/services/stock-opname.service";

export function useCancelStockOpname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      cancelStockOpname(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["stock-opnames"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "stock-opname",
          id,
        ],
      });
    },
  });
}