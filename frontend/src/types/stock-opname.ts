export type StockOpnameStatus =
  | "draft"
  | "finalized"
  | "cancelled";

export interface StockOpnameItem {
  id: number;
  stock_opname_id: number;
  product_id: number | null;
  product_name: string;
  product_sku: string;
  system_stock: number;
  counted_stock: number;
  difference: number;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface StockOpname {
  id: number;
  opname_no: string;
  status: StockOpnameStatus;
  counted_at: string;
  note: string | null;
  finalized_at: string | null;
  items_count?: number;
  items?: StockOpnameItem[];
  created_at: string;
  updated_at: string;
}

export interface StockOpnamePayloadItem {
  product_id: number;
  counted_stock: number;
  note?: string | null;
}

export interface StockOpnamePayload {
  counted_at: string;
  note?: string | null;
  items: StockOpnamePayloadItem[];
}

export interface StockOpnameQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: StockOpnameStatus;
  date_from?: string;
  date_to?: string;
}

export interface StockOpnameListResponse {
  data: StockOpname[];
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

export interface StockOpnameResponse {
  data: StockOpname;
}