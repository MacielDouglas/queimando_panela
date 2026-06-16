import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-orange-300 font-bold tracking-[-0.08em] text-stone-900">
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
  );
}
