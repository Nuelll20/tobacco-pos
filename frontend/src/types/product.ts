export interface Product {
  id: number;
  sku: string;
  name: string;
  purchase_price: number;
  selling_price: number;
  stock: number;
  minimum_stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse {
  data: Product[];
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

export interface ProductPayload {
  sku: string;
  name: string;
  purchase_price: number;
  selling_price: number;
  stock: number;
  minimum_stock: number;
  is_active: boolean;
}

export interface ProductQueryParams {
  page?: number;
  per_page?: number;
}