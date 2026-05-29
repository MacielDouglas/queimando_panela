import Link from 'next/link';
import { getServerSession } from '@/lib/get-server-session';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { getMobileMenuCategories } from '@/features/recipes/actions/get-mobile-menu-categories';

const links = [
  { href: '/', label: 'Home' },
  { href: '/receitas', label: 'Receitas' },
  { href: '/sobre', label: 'Sobre' },
];

export default async function Header() {
  const session = await getServerSession();
  const categories = await getMobileMenuCategories();

  return (
    <header className="w-full border-b border-neutral-100 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="inline-flex items-start gap-3 text-stone-800 transition-opacity hover:opacity-80"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-orange-200 text-[0.9rem] font-bold tracking-[-0.08em]">
            QP
          </div>
          <div className="pt-0.5 leading-none">
            <span className="font-heading block text-[1.05rem] font-extrabold tracking-[-0.04em]">
              Queimando
            </span>
            <span className="font-heading block text-[1.05rem] font-extrabold tracking-[-0.04em]">
              Panela
            </span>
          </div>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-8 lg:flex"
        >
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <MobileMenu
          links={links}
          isLoggedIn={Boolean(session?.user)}
          categories={categories}
        />
      </div>
    </header>
  );
}
