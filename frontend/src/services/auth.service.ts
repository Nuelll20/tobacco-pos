import api from "@/api/axios";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export const login = async (
  payload: LoginRequest
): Promise<LoginResponse> => {

  console.log("LOGIN PAYLOAD:", payload);

  const { data } = await api.post<LoginResponse>("/login", payload);

  return data;
};