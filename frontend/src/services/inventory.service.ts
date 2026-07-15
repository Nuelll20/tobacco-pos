import api from "@/api/axios";

import type {
  InventoryMovement,
  InventoryMovementListResponse,
  InventoryMovementPayload,
  InventoryMovementQueryParams,
} from "@/types/inventory";

export const getInventoryMovements = async (
  params?: InventoryMovementQueryParams
): Promise<InventoryMovementListResponse> => {
  const { data } = await api.get("/inventory-movements", {
    params,
  });

  return data;
};

export const getInventoryMovement = async (
  id: number
): Promise<{ data: InventoryMovement }> => {
  const { data } = await api.get(`/inventory-movements/${id}`);

  return data;
};

export const createInventoryMovement = async (
  payload: InventoryMovementPayload
): Promise<{ data: InventoryMovement }> => {
  const { data } = await api.post("/inventory-movements", payload);

  return data;
};