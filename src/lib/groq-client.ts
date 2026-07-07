import Groq from "groq-sdk";
import { envServer } from "@/lib/env/env.server";

const groq = new Groq({
  apiKey: envServer.GROQ_API_KEY,
});

type ChatParams = {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  // permitir override se quiser
  model?: string;
  maxTokens?: number;
  temperature?: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createChatCompletionWithRetry({
  messages,
  model = "llama-3.3-70b-versatile",
  maxTokens = 2560,
  temperature = 0.2,
}: ChatParams) {
  const maxRetries = 3;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        // se quiser explicitar tier:
        // service_tier: 'on_demand',
      });

      return completion;
    } catch (err: unknown) {
      lastError = err;

      const status =
        typeof err === "object" && err !== null
          ? ((err as Record<string, unknown>).status ??
            (err as Record<string, unknown>).statusCode)
          : undefined;

      const headers =
        typeof err === "object" && err !== null
          ? ((err as Record<string, unknown>).headers as
              | { get?: (key: string) => string | null }
              | undefined)
          : undefined;

      const shouldRetryHeader = headers?.get?.("x-should-retry");
      const retryAfterHeader = headers?.get?.("retry-after");

      const statusCode = typeof status === "number" ? status : 0;

      const shouldRetryByHeader =
        shouldRetryHeader === "true" ||
        (shouldRetryHeader !== "false" &&
          statusCode >= 500 &&
          statusCode !== 501 &&
          statusCode !== 505);

      if (!shouldRetryByHeader || attempt === maxRetries) {
        break;
      }

      // respeita Retry-After se vier numa janela razoável
      let delayMs = 0;
      if (retryAfterHeader) {
        const seconds = Number(retryAfterHeader);
        if (!Number.isNaN(seconds) && seconds >= 0 && seconds <= 60) {
          delayMs = seconds * 1000;
        }
      }

      if (delayMs === 0) {
        // backoff exponencial básico com jitter
        const base = 500 * 2 ** attempt;
        const jitter = 0.75 + Math.random() * 0.25;
        delayMs = Math.min(base, 8000) * jitter;
      }

      console.warn(
        `[groq] tentativa ${attempt + 1} falhou (status ${status}), tentando novamente em ${Math.round(delayMs)}ms`,
      );
      await sleep(delayMs);
    }
  }

  throw lastError;
}
