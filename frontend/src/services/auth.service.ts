import api from "@/services/api";

import type { LoginFormData } from "@/schemas/auth";

export async function login(data: LoginFormData) {
    const response = await api.post("/login", data);

    return response.data;
}