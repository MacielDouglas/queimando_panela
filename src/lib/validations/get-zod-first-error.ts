import type { ZodError } from "zod";

export function getZodFirstError(error: ZodError): string {
  return error.issues[0]?.message ?? "Dados inválidos.";
}
