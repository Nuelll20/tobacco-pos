export type PaymentMethod = "cash" | "qris" | "transfer";

export interface TransactionItem {
  id: number;
  transaction_id: number;
  product_id: number | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  transaction_no: string;
  total_amount: string;
  payment_method: PaymentMethod;
  paid_amount: string;
  change_amount: string;
  note: string | null;
  items?: TransactionItem[];
  created_at: string;
  updated_at: string;
}

export interface TransactionListResponse {
  data: Transaction[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface TransactionItemPayload {
  product_id: number;
  quantity: number;
}

export interface TransactionPayload {
  payment_method: PaymentMethod;
  paid_amount: number;
  note?: string | null;
  items: TransactionItemPayload[];
}

export interface TransactionQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  payment_method?: PaymentMethod;
}