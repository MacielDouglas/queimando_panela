import { redirect } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';
import SignUpPage from '@/app/(auth)/criar-conta/page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('CriarContaPage (redirect)', () => {
  it('redireciona para /sign-up', () => {
    SignUpPage();
    expect(redirect).toHaveBeenCalledWith('/sign-up');
  });
});
