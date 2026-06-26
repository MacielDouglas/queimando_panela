import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, "E-mail é obrigatório.")
  .email("E-mail inválido.");

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres.");

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres.").trim(),
  email: emailSchema,
  password: passwordSchema,
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
