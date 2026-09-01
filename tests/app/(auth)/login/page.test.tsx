import { redirect } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';
import SignInPage from '@/app/(auth)/login/page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('LoginPage (redirect)', () => {
  it('redireciona para /sign-in', () => {
    SignInPage();
    expect(redirect).toHaveBeenCalledWith('/sign-in');
  });
});
