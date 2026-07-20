import { useQuery } from "@tanstack/react-query";

import { getStockOpname } from "@/services/stock-opname.service";

export function useStockOpname(
  id: number | null,
) {
  return useQuery({
    queryKey: [
      "stock-opname",
      id,
    ],

    queryFn: () =>
      getStockOpname(id as number),

    enabled: id !== null,
  });
}