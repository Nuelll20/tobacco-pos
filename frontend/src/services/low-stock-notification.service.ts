import api from "@/api/axios";

import type {
  LowStockNotificationResponse,
} from "@/types/low-stock-notification";

export async function getLowStockNotifications(): Promise<LowStockNotificationResponse> {
  const { data } = await api.get(
    "/notifications/low-stock",
  );

  return data;
}