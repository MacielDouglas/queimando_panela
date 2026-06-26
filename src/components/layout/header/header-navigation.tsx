import Link from "next/link";
import { headerNavItems } from "./header-nav-items";

export function HeaderNavigation() {
  return (
    <nav aria-label="Navegação principal">
      <ul className="flex items-center gap-10">
        {headerNavItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-950"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
