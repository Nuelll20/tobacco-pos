import api from "@/api/axios";

import type {
  Transaction,
  TransactionListResponse,
  TransactionPayload,
  TransactionQueryParams,
} from "@/types/transaction";

export const getTransactions = async (
  params?: TransactionQueryParams
): Promise<TransactionListResponse> => {
  const { data } = await api.get("/transactions", {
    params,
  });

  return data;
};

export const getTransaction = async (
  id: number
): Promise<{ data: Transaction }> => {
  const { data } = await api.get(`/transactions/${id}`);

  return data;
};

export const createTransaction = async (
  payload: TransactionPayload
): Promise<{ data: Transaction }> => {
  const { data } = await api.post("/transactions", payload);

  return data;
};