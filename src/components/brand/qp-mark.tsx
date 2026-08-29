import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type QPMarkProps = ComponentProps<'span'> & {
  label?: string;
};

export function QPMark({
  className,
  label = 'Queimando Panela',
  ...props
}: QPMarkProps) {
  return (
    <span
      role="img"
      aria-label={label}
      title="Queimando Panela — onde olhômetro vira medida"
      className={cn(
        'qp-mark-delight inline-grid size-[34px] place-items-center rounded-full text-[#183a37] font-body text-[0.88rem] font-bold',
        className,
      )}
      style={{
        background: 'var(--accent-e)',
        borderRadius: '50% 50% 50% 8px',
        transform: 'rotate(-18deg)',
      }}
      {...props}
    >
      QP
    </span>
  );
}

export function QPWordmark({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col font-display font-bold uppercase leading-none tracking-[0.06em] text-[#183a37]',
        className,
      )}
      {...props}
    >
      <span className="text-[1.35rem]">Queimando</span>
      <span className="text-[1.35rem]">Panela</span>
    </div>
  );
}
