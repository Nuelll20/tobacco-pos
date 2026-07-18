import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useLogin } from "@/hooks/useLogin";

import {
  loginSchema,
  type LoginFormData,
} from "@/schemas/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const { t } = useTranslation();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  function translateValidationMessage(
    message?: string,
  ): string {
    return message
      ? t(message, {
          defaultValue: message,
        })
      : "";
  }

  function onSubmit(data: LoginFormData) {
    loginMutation.mutate(data);
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          {t("common.appName")}
        </CardTitle>

        <p className="text-center text-sm text-muted-foreground">
          {t("auth.signInDescription")}
        </p>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="email">
              {t("auth.email")}
            </Label>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t(
                "auth.emailPlaceholder",
              )}
              disabled={loginMutation.isPending}
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-destructive">
                {translateValidationMessage(
                  errors.email.message,
                )}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {t("auth.password")}
            </Label>

            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder={t(
                "auth.passwordPlaceholder",
              )}
              disabled={loginMutation.isPending}
              {...register("password")}
            />

            {errors.password && (
              <p className="text-sm text-destructive">
                {translateValidationMessage(
                  errors.password.message,
                )}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending
              ? t("auth.signingIn")
              : t("auth.signIn")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}