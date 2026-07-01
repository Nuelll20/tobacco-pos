import { useEffect } from "react";
import { me } from "@/services/auth.service";
import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (!token) return;

        me()
            .then((response) => {
                login(response.user, token);
            })
            .catch(() => {
                logout();
            });
    }, [token, login, logout]);
}