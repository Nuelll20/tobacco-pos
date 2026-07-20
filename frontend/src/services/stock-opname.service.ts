import api from "@/api/axios";

import type {
  StockOpnameListResponse,
  StockOpnamePayload,
  StockOpnameQueryParams,
  StockOpnameResponse,
} from "@/types/stock-opname";

export async function getStockOpnames(
  params?: StockOpnameQueryParams,
): Promise<StockOpnameListResponse> {
  const { data } = await api.get(
    "/stock-opnames",
    {
      params,
    },
  );

  return data;
}

export async function getStockOpname(
  id: number,
): Promise<StockOpnameResponse> {
  const { data } = await api.get(
    `/stock-opnames/${id}`,
  );

  return data;
}

export async function createStockOpname(
  payload: StockOpnamePayload,
): Promise<StockOpnameResponse> {
  const { data } = await api.post(
    "/stock-opnames",
    payload,
  );

  return data;
}

export async function updateStockOpname(
  id: number,
  payload: StockOpnamePayload,
): Promise<StockOpnameResponse> {
  const { data } = await api.patch(
    `/stock-opnames/${id}`,
    payload,
  );

  return data;
}

export async function finalizeStockOpname(
  id: number,
): Promise<StockOpnameResponse> {
  const { data } = await api.post(
    `/stock-opnames/${id}/finalize`,
  );

  return data;
}

export async function cancelStockOpname(
  id: number,
): Promise<StockOpnameResponse> {
  const { data } = await api.post(
    `/stock-opnames/${id}/cancel`,
  );

  return data;
}