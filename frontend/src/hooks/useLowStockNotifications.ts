import { useQuery } from "@tanstack/react-query";

import {
  getLowStockNotifications,
} from "@/services/low-stock-notification.service";

export const lowStockNotificationQueryKey = [
  "notifications",
  "low-stock",
] as const;

export function useLowStockNotifications() {
  return useQuery({
    queryKey: lowStockNotificationQueryKey,
    queryFn: getLowStockNotifications,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}