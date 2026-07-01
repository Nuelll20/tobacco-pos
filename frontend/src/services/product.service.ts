import api from "@/api/axios";
import type {
  Product,
  ProductListResponse,
  ProductPayload,
} from "@/types/product";

export const getProducts = async (): Promise<ProductListResponse> => {
  const { data } = await api.get("/products");
  return data;
};

export const getProduct = async (id: number): Promise<{ data: Product }> => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProduct = async (
  payload: ProductPayload
): Promise<{ data: Product }> => {
  const { data } = await api.post("/products", payload);
  return data;
};

export const updateProduct = async (
  id: number,
  payload: ProductPayload
): Promise<{ data: Product }> => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};