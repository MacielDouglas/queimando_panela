import Link from "next/link";

export function HeaderLogo() {
  return (
    <Link
      href="/"
      aria-label="Página inicial"
      className="flex items-center gap-3"
    >
      <div className="flex h-10 w-10 items-center justify-center bg-amber-100 text-sm font-bold text-amber-700">
        QP
      </div>

      <span className="hidden text-sm font-semibold tracking-[0.08em] text-neutral-900 md:block">
        QUEIMANDO PANELA
      </span>
    </Link>
  );
}
