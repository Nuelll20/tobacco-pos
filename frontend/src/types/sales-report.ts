import type {
  PaymentMethod,
} from "@/types/transaction";

export interface SalesReportQueryParams {
  search?: string;
  payment_method?: PaymentMethod;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

export interface SalesReportSummary {
  total_sales: string;
  total_cost: string;
  gross_profit: string;
  gross_margin_percentage: string;
  profit_eligible_sales: string;
  transaction_count: number;
  products_sold: number;
  average_transaction: string;
  costed_items_count: number;
  missing_cost_items_count: number;
  profit_data_complete: boolean;
}

export interface SalesReportTopProduct {
  product_id: number | null;
  product_name: string;
  product_sku: string;
  quantity_sold: number;
  total_sales: string;
  profit_eligible_sales: string;
  total_cost: string;
  gross_profit: string;
  gross_margin_percentage: string;
  missing_cost_items_count: number;
  profit_data_complete: boolean;
}

export interface SalesReportProfitableProduct {
  product_id: number | null;
  product_name: string;
  product_sku: string;
  quantity_sold: number;
  total_sales: string;
  total_cost: string;
  gross_profit: string;
  gross_margin_percentage: string;
  costed_items_count: number;
  profit_data_complete: boolean;
}

export interface SalesReportTransactionItem {
  id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
  unit_cost: string | null;
  cost_subtotal: string | null;
  gross_profit: string | null;
  gross_margin_percentage: string | null;
  profit_data_complete: boolean;
}

export interface SalesReportTransaction {
  id: number;
  transaction_no: string;
  payment_method: PaymentMethod;
  total_amount: string;
  profit_eligible_sales: string;
  total_cost: string;
  gross_profit: string;
  gross_margin_percentage: string;
  missing_cost_items_count: number;
  profit_data_complete: boolean;
  paid_amount: string;
  change_amount: string;
  products_sold: number;
  items: SalesReportTransactionItem[];
  note: string | null;
  created_at: string;
}

export interface SalesReportTransactions {
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
  most_profitable_products:
    SalesReportProfitableProduct[];
  transactions: SalesReportTransactions;
}

export interface SalesReportResponse {
  data: SalesReportData;
}