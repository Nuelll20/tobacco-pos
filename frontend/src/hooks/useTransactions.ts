import { useQuery } from "@tanstack/react-query";

import { getTransactions } from "@/services/transaction.service";

import type { TransactionQueryParams } from "@/types/transaction";

export function useTransactions(
  params?: TransactionQueryParams
) {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => getTransactions(params),
  });
}
