import { useQuery } from "@tanstack/react-query";

import { getSalesReport } from "@/services/sales-report.service";

import type {
  SalesReportQueryParams,
} from "@/types/sales-report";

export function useSalesReport(
  params?: SalesReportQueryParams
) {
  return useQuery({
    queryKey: [
      "reports",
      "sales",
      params,
    ],
    queryFn: () => getSalesReport(params),
  });
}
