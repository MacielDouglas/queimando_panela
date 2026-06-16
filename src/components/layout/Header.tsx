import { getMobileMenuCategories } from '@/features/recipes/actions/get-mobile-menu-categories';
import { getServerSession } from '@/lib/get-server-session';
import Link from 'next/link';
import { SignOutButton } from '../auth/sign-out-button';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { NavLink } from './NavLink';

const links = [
  { href: '/', label: 'Home' },
  { href: '/receitas', label: 'Receitas' },
  { href: '/sobre', label: 'Sobre' },
];

export default async function Header() {
  const session = await getServerSession();
  const categories = await getMobileMenuCategories();

  return (
    <header className="absolute z-20 w-full">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-8 lg:flex"
        >
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* BRAND DIREITA — desktop */}
        <div className="hidden items-center gap-6 lg:flex">
          {session?.user ? (
            <SignOutButton />
          ) : (
            <Link
              href="/login"
              aria-label="Entrar na conta"
              className="bg-amber-500 px-4 py-2 text-sm font-bold tracking-widest text-zinc-900 uppercase transition-colors duration-300 hover:bg-amber-600 hover:text-zinc-800"
            >
              Login
            </Link>
          )}
        </div>

        <MobileMenu
          links={links}
          isLoggedIn={Boolean(session?.user)}
          categories={categories}
        />
      </div>
    </header>
  );
}
