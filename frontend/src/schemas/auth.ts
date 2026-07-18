import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(
    "auth.validation.invalidEmail",
  ),

  password: z
    .string()
    .min(
      6,
      "auth.validation.passwordMinimum",
    ),
});

export type LoginFormData =
  z.infer<typeof loginSchema>;