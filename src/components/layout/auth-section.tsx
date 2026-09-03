'use client';

import dynamic from 'next/dynamic';

const AuthNavButton = dynamic(
  () =>
    import('@/components/layout/auth-nav-button').then((m) => m.AuthNavButton),
  { ssr: false },
);

const MobileMenu = dynamic(
  () => import('@/components/layout/mobile-menu').then((m) => m.MobileMenu),
  { ssr: false },
);

export function AuthSection() {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:block">
        <AuthNavButton />
      </div>
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </div>
  );
}
