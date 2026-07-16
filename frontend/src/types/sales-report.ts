import type {
  PaymentMethod,
} from "@/types/transaction";

export interface SalesReportSummary {
  total_sales: string;
  transaction_count: number;
  products_sold: number;
  average_transaction: string;
}

export interface SalesReportTopProduct {
  product_id: number | null;
  product_name: string;
  product_sku: string;
  quantity_sold: number;
  total_sales: string;
}

export interface SalesReportTransaction {
  id: number;
  transaction_no: string;
  payment_method: PaymentMethod;
  total_amount: string;
  paid_amount: string;
  change_amount: string;
  products_sold: number;
  note: string | null;
  created_at: string;
}

export interface SalesReportTransactionsPagination {
  data: SalesReportTransaction[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface SalesReportData {
  summary: SalesReportSummary;
  top_products: SalesReportTopProduct[];
  transactions: SalesReportTransactionsPagination;
}

export interface SalesReportResponse {
  data: SalesReportData;
}

export interface SalesReportQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  payment_method?: PaymentMethod;
  start_date?: string;
  end_date?: string;
}
