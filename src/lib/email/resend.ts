import { Resend } from 'resend';
import { envServer } from '@/lib/env/env.server';

function getApiKey(): string {
  const apiKey = envServer.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY não configurada.');
  return apiKey;
}

// Lazy: só instancia ao primeiro uso, evita ZodError no import de auth.ts
let _resend: Resend | null = null;

export const resend: Resend = new Proxy({} as Resend, {
  get(_target, prop) {
    if (!_resend) _resend = new Resend(getApiKey());
    const value = (_resend as unknown as Record<string | symbol, unknown>)[
      prop
    ];
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(_resend)
      : value;
  },
});
