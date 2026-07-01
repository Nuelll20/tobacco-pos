import api from "@/api/axios";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export const login = async (
  payload: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/login", payload);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/logout");
};

export const me = async () => {
  const { data } = await api.get("/me");
  return data;
};