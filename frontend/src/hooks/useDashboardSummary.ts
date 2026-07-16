import { useQuery } from "@tanstack/react-query";

import { getDashboardSummary } from "@/services/dashboard.service";

import type { DashboardSummaryParams } from "@/types/dashboard";

export function useDashboardSummary(
  params?: DashboardSummaryParams
) {
  return useQuery({
    queryKey: [
      "dashboard",
      "summary",
      params,
    ],
    queryFn: () => getDashboardSummary(params),
  });
}
