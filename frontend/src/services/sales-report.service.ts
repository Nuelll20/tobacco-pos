import api from "@/api/axios";

import type {
  SalesReportQueryParams,
  SalesReportResponse,
} from "@/types/sales-report";

export async function getSalesReport(
  params?: SalesReportQueryParams
): Promise<SalesReportResponse> {
  const { data } = await api.get(
    "/reports/sales",
    {
      params,
    }
  );

  return data;
}
