import { useQuery } from "@tanstack/react-query";

import { getStockOpnames } from "@/services/stock-opname.service";

import type {
  StockOpnameQueryParams,
} from "@/types/stock-opname";

export function useStockOpnames(
  params?: StockOpnameQueryParams,
) {
  return useQuery({
    queryKey: [
      "stock-opnames",
      params,
    ],

    queryFn: () =>
      getStockOpnames(params),
  });
}