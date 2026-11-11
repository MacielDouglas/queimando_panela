'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type LegalTocItem = {
  id: string;
  label: string;
};

type LegalTableOfContentsProps = {
  items: LegalTocItem[];
  compact?: boolean;
};

export function LegalTableOfContents({
  items,
  compact = false,
}: LegalTableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-150px 0px -65% 0px', threshold: 0 },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    const lastSection = sections[sections.length - 1];

    const updateAtPageEnd = () => {
      const atPageEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;

      if (atPageEnd && lastSection) {
        setActiveId(lastSection.id);
      }
    };

    window.addEventListener('scroll', updateAtPageEnd, { passive: true });
    updateAtPageEnd();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateAtPageEnd);
    };
  }, [items]);

  return (
    <nav aria-label="Índice do documento">
      {!compact ? (
        <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          Neste documento
        </p>
      ) : null}

      <ol className={cn('space-y-0.5', compact ? 'mt-1' : 'mt-4')}>
        {items.map((item, index) => {
          const active = item.id === activeId;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? 'location' : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-2.5 px-2 py-1.5 text-[0.82rem] leading-snug transition-colors',
                  active
                    ? 'bg-[var(--paper-strong)] font-semibold text-[var(--cocoa)]'
                    : 'text-[var(--ink-muted)] hover:bg-[var(--paper-strong)]/60 hover:text-[var(--cocoa)]',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'font-display text-[0.72rem] tabular-nums',
                    active
                      ? 'text-[var(--clay)]'
                      : 'text-[var(--ink-muted)]/70',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
