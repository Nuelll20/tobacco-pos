import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { login as loginService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/authStore";

export function useLogin() {
    const login = useAuthStore((state) => state.login);

    const navigate = useNavigate();

    return useMutation({
        mutationFn: loginService,

        onSuccess: (data) => {
            login(data.user, data.token);

            navigate("/");
        },

        onError: (error) => {
            console.error(error);
        },
    });
}