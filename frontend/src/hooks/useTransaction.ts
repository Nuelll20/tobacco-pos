import { useQuery } from "@tanstack/react-query";

import { getTransaction } from "@/services/transaction.service";

export function useTransaction(
  id: number | null,
  enabled = true
) {
  return useQuery({
    queryKey: ["transactions", "detail", id],
    queryFn: () => getTransaction(id as number),
    enabled: enabled && id !== null,
  });
}
