export interface Supplier {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierListResponse {
  data: Supplier[];
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

export interface SupplierPayload {
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  is_active: boolean;
}

export interface SupplierQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
  sort_by?: SupplierSortBy;
  sort_direction?: SortDirection;
}

export type SupplierSortBy =
  | "name"
  | "created_at";

export type SortDirection =
  | "asc"
  | "desc";