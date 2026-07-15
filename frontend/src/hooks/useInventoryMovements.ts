import { useQuery } from "@tanstack/react-query";

import { getInventoryMovements } from "@/services/inventory.service";

import type { InventoryMovementQueryParams } from "@/types/inventory";

export function useInventoryMovements(
  params?: InventoryMovementQueryParams
) {
  return useQuery({
    queryKey: ["inventory-movements", params],
    queryFn: () => getInventoryMovements(params),
  });
}