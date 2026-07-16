import api from "@/api/axios";

import type {
  DashboardSummaryParams,
  DashboardSummaryResponse,
} from "@/types/dashboard";

export async function getDashboardSummary(
  params?: DashboardSummaryParams
): Promise<DashboardSummaryResponse> {
  const { data } = await api.get(
    "/dashboard/summary",
    {
      params,
    }
  );

  return data;
}
