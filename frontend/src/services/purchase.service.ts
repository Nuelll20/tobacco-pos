import api from "@/api/axios";

import type {
  Purchase,
  PurchaseListResponse,
  PurchasePayload,
  PurchaseQueryParams,
} from "@/types/purchase";

export const getPurchases = async (
  params?: PurchaseQueryParams,
): Promise<PurchaseListResponse> => {
  const { data } = await api.get(
    "/purchases",
    {
      params,
    },
  );

  return data;
};

export const getPurchase = async (
  id: number,
): Promise<{ data: Purchase }> => {
  const { data } = await api.get(
    `/purchases/${id}`,
  );

  return data;
};

export const createPurchase = async (
  payload: PurchasePayload,
): Promise<{ data: Purchase }> => {
  const { data } = await api.post(
    "/purchases",
    payload,
  );

  return data;
};

export const updatePurchase = async (
  id: number,
  payload: PurchasePayload,
): Promise<{ data: Purchase }> => {
  const { data } = await api.patch(
    `/purchases/${id}`,
    payload,
  );

  return data;
};

export const receivePurchase = async (
  id: number,
): Promise<{ data: Purchase }> => {
  const { data } = await api.post(
    `/purchases/${id}/receive`,
  );

  return data;
};

export const cancelPurchase = async (
  id: number,
): Promise<{ data: Purchase }> => {
  const { data } = await api.post(
    `/purchases/${id}/cancel`,
  );

  return data;
};