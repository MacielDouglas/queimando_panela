import Link from "next/link";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getServerSession } from "@/lib/get-server-session";
import { HeaderMobileMenu } from "./header-mobile-menu";
import { HeaderNavigation } from "./header-navigation";
import { HeaderLogo } from "./logo";

export async function Header() {
  const session = await getServerSession();

  return (
    <header className="z-50 border-b border-neutral-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <HeaderLogo />

        <div className="hidden lg:block">
          <HeaderNavigation />
        </div>

        <div className="hidden lg:block">
          {session?.user ? (
            <SignOutButton />
          ) : (
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center bg-amber-500 px-5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-400"
            >
              Entrar
            </Link>
          )}
        </div>

        <div className="lg:hidden">
          <HeaderMobileMenu />
        </div>
      </div>
    </header>
  );
}
