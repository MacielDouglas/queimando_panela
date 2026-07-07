"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { isActivePath } from "@/components/layout/is-active-path";
import type { NavItem } from "@/components/layout/navigation-data";
import { cn } from "@/lib/utils";

type NavLinksProps = {
  items: NavItem[];
  orientation?: "horizontal" | "vertical";
  variant?: "header" | "footer" | "mobile";
  className?: string;
  itemClassName?: string;
  wrapItem?: (link: ReactNode, item: NavItem) => ReactNode;
};

export function NavLinks({
  items,
  orientation = "horizontal",
  variant = "header",
  className,
  itemClassName,
  wrapItem,
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul
      className={cn(
        "flex",
        orientation === "horizontal" ? "items-center gap-8" : "flex-col gap-1",
        className,
      )}
    >
      {items.map((item) => {
        const active = isActivePath(pathname, item.href, item.exact);

        const link = (
          <Link
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "transition-colors",
              variant === "header" &&
                "text-sm font-medium uppercase tracking-[0.16em]",
              variant === "footer" && "text-sm",
              variant === "mobile" &&
                "flex min-h-12 items-center border-b border-stone-200 py-3 text-base font-medium uppercase tracking-[0.14em]",
              active
                ? "text-amber-500"
                : variant === "footer"
                  ? "text-stone-200 hover:text-amber-500"
                  : variant === "mobile"
                    ? "text-stone-900 hover:text-amber-500"
                    : "text-stone-700 hover:text-amber-500",
              itemClassName,
            )}
          >
            {item.label}
          </Link>
        );

        return (
          <li key={item.href}>{wrapItem ? wrapItem(link, item) : link}</li>
        );
      })}
    </ul>
  );
}
