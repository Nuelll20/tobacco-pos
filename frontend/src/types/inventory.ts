export type InventoryMovementType =
  | "stock_in"
  | "stock_out"
  | "adjustment";

export interface InventoryMovementProduct {
  id: number;
  name: string;
  sku: string;
  stock: number;
}

export interface InventoryMovement {
  id: number;
  product_id: number;
  product?: InventoryMovementProduct;
  type: InventoryMovementType;
  quantity: number;
  stock_before: number;
  stock_after: number;
  reference_no: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryMovementListResponse {
  data: InventoryMovement[];
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

export interface InventoryMovementPayload {
  product_id: number;
  type: InventoryMovementType;
  quantity: number;
  reference_no?: string | null;
  note?: string | null;
}

export interface InventoryMovementQueryParams {
  page?: number;
  per_page?: number;
  product_id?: number;
  type?: InventoryMovementType;
  search?: string;
}