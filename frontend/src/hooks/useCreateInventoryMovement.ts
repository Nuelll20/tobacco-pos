import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  lowStockNotificationQueryKey,
} from "@/hooks/useLowStockNotifications";
import {
  createInventoryMovement,
} from "@/services/inventory.service";

import type {
  InventoryMovementPayload,
} from "@/types/inventory";

export function useCreateInventoryMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: InventoryMovementPayload,
    ) => createInventoryMovement(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "inventory-movements",
        ],
      });

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