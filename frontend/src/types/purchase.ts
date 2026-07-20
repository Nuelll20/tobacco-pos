import type {
  Supplier,
} from "@/types/supplier";

export type PurchaseReceiptStatus =
  | "draft"
  | "ordered"
  | "received"
  | "cancelled";

export type EditablePurchaseReceiptStatus =
  | "draft"
  | "ordered";

export type PurchasePaymentStatus =
  | "unpaid"
  | "partial"
  | "paid";

export interface PurchaseItem {
  id: number;
  product_id: number | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_cost: string;
  subtotal: string;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: number;
  purchase_no: string;
  purchase_date: string;

  supplier_id: number;
  supplier?: Supplier;

  receipt_status: PurchaseReceiptStatus;
  payment_status: PurchasePaymentStatus;

  paid_amount: string;
  total_amount: string;

  notes: string | null;
  received_at: string | null;

  items_count?: number;
  items?: PurchaseItem[];

  created_at: string;
  updated_at: string;
}

export interface PurchaseListResponse {
  data: Purchase[];

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

export interface PurchaseItemPayload {
  product_id: number;
  quantity: number;
  unit_cost: number;
}

export interface PurchasePayload {
  purchase_date: string;
  supplier_id: number;
  receipt_status: EditablePurchaseReceiptStatus;
  paid_amount: number;
  notes?: string | null;
  items: PurchaseItemPayload[];
}

export interface PurchaseQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  supplier_id?: number;
  receipt_status?: PurchaseReceiptStatus;
  payment_status?: PurchasePaymentStatus;
  date_from?: string;
  date_to?: string;
}