import { useQuery } from "@tanstack/react-query";

import { getPurchase } from "@/services/purchase.service";

export function usePurchase(
  id: number | null,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      "purchases",
      "detail",
      id,
    ],

    queryFn: () =>
      getPurchase(id as number),

    enabled:
      enabled &&
      id !== null,
  });
}