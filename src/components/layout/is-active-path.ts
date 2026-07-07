export function isActivePath(pathname: string, href: string, exact = false) {
  if (exact) {
    return pathname === href;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
