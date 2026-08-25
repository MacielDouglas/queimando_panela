import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type QPMarkProps = ComponentProps<'svg'> & {
  label?: string;
};

export function QPMark({
  className,
  label = 'Queimando Panela',
  ...props
}: QPMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label={label}
      className={cn('size-10', className)}
      fill="none"
      {...props}
    >
      {/* Panela moderna — corpo 12px radius, alças, tampa */}
      <rect
        x="6"
        y="10"
        width="20"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {/* Alças */}
      <path
        d="M6 14 H4.5 C3.1 14 2 15.1 2 16.5 C2 17.9 3.1 19 4.5 19 H6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M26 14 H27.5 C28.9 14 30 15.1 30 16.5 C30 17.9 28.9 19 27.5 19 H26"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Tampa */}
      <path
        d="M8 10 L8 8.5 C8 7.1 9.1 6 10.5 6 H21.5 C22.9 6 24 7.1 24 8.5 L24 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M14 6 V4.5 C14 3.7 14.7 3 15.5 3 H16.5 C17.3 3 18 3.7 18 4.5 V6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Chama/IA spark — #ffb900 */}
      <path
        d="M16 22 C16 19.5 17.8 17.8 16 14 C14.2 17.8 16 19.5 16 22 Z"
        fill="#ffb900"
        stroke="#ffb900"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="23.2" r="1.1" fill="#0a0a0a" />
      {/* Detalhe inferior — sombra pot */}
      <rect
        x="9"
        y="23"
        width="14"
        height="1.2"
        rx="0.6"
        fill="currentColor"
        opacity="0.12"
      />
    </svg>
  );
}

export function QPWordmark({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col font-display font-extrabold uppercase leading-none tracking-[0.08em]',
        className,
      )}
      {...props}
    >
      <span className="text-[11px] tracking-[0.14em]">Queimando</span>
      <span className="text-[11px] tracking-[0.14em]">Panela</span>
    </div>
  );
}
