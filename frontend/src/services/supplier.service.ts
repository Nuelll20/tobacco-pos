import api from "@/api/axios";

import type {
  Supplier,
  SupplierListResponse,
  SupplierPayload,
  SupplierQueryParams,
} from "@/types/supplier";

export const getSuppliers = async (
  params?: SupplierQueryParams,
): Promise<SupplierListResponse> => {
  const normalizedParams = {
    ...params,

    is_active:
      params?.is_active === undefined
        ? undefined
        : params.is_active
          ? 1
          : 0,
  };

  const { data } = await api.get(
    "/suppliers",
    {
      params: normalizedParams,
    },
  );

  return data;
};

export const getSupplier = async (
  id: number,
): Promise<{ data: Supplier }> => {
  const { data } = await api.get(
    `/suppliers/${id}`,
  );

  return data;
};

export const createSupplier = async (
  payload: SupplierPayload,
): Promise<{ data: Supplier }> => {
  const { data } = await api.post(
    "/suppliers",
    payload,
  );

  return data;
};

export const updateSupplier = async (
  id: number,
  payload: SupplierPayload,
): Promise<{ data: Supplier }> => {
  const { data } = await api.patch(
    `/suppliers/${id}`,
    payload,
  );

  return data;
};

export const deactivateSupplier = async (
  id: number,
): Promise<void> => {
  await api.delete(
    `/suppliers/${id}`,
  );
};