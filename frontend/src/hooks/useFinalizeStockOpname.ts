import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  lowStockNotificationQueryKey,
} from "@/hooks/useLowStockNotifications";
import {
  finalizeStockOpname,
} from "@/services/stock-opname.service";

export function useFinalizeStockOpname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      finalizeStockOpname(id),

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

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "inventory-movements",
        ],
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