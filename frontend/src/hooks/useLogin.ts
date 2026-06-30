import { useMutation } from "@tanstack/react-query";

import { login } from "@/services/auth.service";
import { useAuthStore } from "@/stores/authStore";

export function useLogin() {
    const setUser = useAuthStore((state) => state.setUser);
    const setToken = useAuthStore((state) => state.setToken);

    return useMutation({
        mutationFn: login,

        onSuccess: (data) => {
            /**
             * Struktur response Laravel nanti kurang lebih:
             *
             * {
             *   user: {...},
             *   token: "xxxxxxxx"
             * }
             */

            setUser(data.user);
            setToken(data.token);
        },

        onError: (error) => {
            console.error(error);
        },
    });
}