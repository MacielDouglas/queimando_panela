import { z } from "zod";

export const signInSchema = z.object({
  email: z
  .email("Informe um e-mail válido.")
    .trim()
    .min(1, "Informe seu e-mail."),
  password: z
    .string()
    .min(1, "Informe sua senha.")
    .min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Informe seu nome.")
      .max(80, "Seu nome deve ter no máximo 80 caracteres."),
    email: z
    .email("Informe um e-mail válido.")
      .trim()
      .min(1, "Informe seu e-mail."),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres.")
      .max(128, "A senha deve ter no máximo 128 caracteres."),
    confirmPassword: z
      .string()
      .min(1, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem.",
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
