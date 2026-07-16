import type { PaymentMethod } from "@/types/transaction";

export type DashboardPeriod =
  | "today"
  | "7_days"
  | "30_days"
  | "custom";

export interface DashboardPeriodInfo {
  key: DashboardPeriod;
  start_date: string;
  end_date: string;
}

export interface DashboardSummaryMetrics {
  total_sales: string;
  transaction_count: number;
  products_sold: number;
  average_transaction: string;
}

export interface DashboardDailySales {
  date: string;
  total_sales: string;
  transaction_count: number;
}

export interface DashboardPaymentMethod {
  payment_method: PaymentMethod;
  transaction_count: number;
  total_sales: string;
}

export interface DashboardRecentTransaction {
  id: number;
  transaction_no: string;
  payment_method: PaymentMethod;
  total_amount: string;
  products_sold: number;
  created_at: string;
}

export interface DashboardLowStockProduct {
  id: number;
  sku: string;
  name: string;
  stock: number;
  minimum_stock: number;
  stock_shortage: number;
}

export interface DashboardSummaryData {
  period: DashboardPeriodInfo;
  summary: DashboardSummaryMetrics;
  daily_sales: DashboardDailySales[];
  payment_methods: DashboardPaymentMethod[];
  recent_transactions: DashboardRecentTransaction[];
  low_stock_products: DashboardLowStockProduct[];
}

export interface DashboardSummaryResponse {
  data: DashboardSummaryData;
}

export interface DashboardSummaryParams {
  period?: DashboardPeriod;
  start_date?: string;
  end_date?: string;
}
