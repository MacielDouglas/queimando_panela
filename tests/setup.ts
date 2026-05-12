import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers()),
}));
