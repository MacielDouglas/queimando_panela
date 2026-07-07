import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .email("Informe um e-mail válido.")
    .trim()
    .min(1, "Informe seu e-mail."),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
