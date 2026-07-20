export interface LowStockNotificationItem {
  id: number;
  sku: string;
  name: string;
  stock: number;
  minimum_stock: number;
  stock_shortage: number;
  is_out_of_stock: boolean;
}

export interface LowStockNotificationData {
  count: number;
  items: LowStockNotificationItem[];
  has_more: boolean;
}

export interface LowStockNotificationResponse {
  data: LowStockNotificationData;
}