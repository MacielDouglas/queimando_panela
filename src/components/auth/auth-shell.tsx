import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLinkHref: string;
  footerLinkLabel: string;
};

export function AuthShell({
  title,
  description,
  children,
  footerText,
  footerLinkHref,
  footerLinkLabel,
}: AuthShellProps) {
  return (
    <main className="min-h-dvh" style={{ background: 'var(--cream)' }}>
      <div className="editorial-container flex min-h-[calc(100dvh-96px)] items-center justify-center py-12 lg:py-16">
        <div
          className="qp-reveal grid w-full max-w-5xl overflow-hidden bg-white"
          style={{
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--line)',
            boxShadow: '0 16px 36px rgba(27, 41, 32, 0.08)',
          }}
        >
          <div className="grid md:grid-cols-[1.05fr_0.95fr]">
            {/* Lado editorial — mesmo idioma de ValuesSection */}
            <section
              className="hidden flex-col justify-between p-8 lg:p-10 md:flex"
              style={{ background: 'var(--cocoa)', color: 'white' }}
            >
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
                  style={{
                    background: 'var(--food-accent)',
                    color: 'var(--cocoa)',
                  }}
                >
                  <span
                    className="grid size-7 place-items-center rounded-full text-xs font-extrabold"
                    style={{
                      background: 'var(--cocoa)',
                      color: 'var(--food-accent)',
                    }}
                    aria-hidden="true"
                  >
                    QP
                  </span>
                  <span
                    className="text-[0.78rem] font-extrabold uppercase"
                    style={{ letterSpacing: '0.08em' }}
                  >
                    Queimando Panela
                  </span>
                </Link>

                <div className="mt-10 max-w-md space-y-4">
                  <p
                    className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[0.78rem] font-bold uppercase"
                    style={{
                      background: 'var(--food-accent)',
                      color: 'var(--cocoa)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Cozinha com história
                  </p>
                  <h1 className="font-display text-[clamp(2rem,3vw,2.6rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-balance text-white">
                    Receitas para
                    <br />
                    guardar, testar
                    <br />e compartilhar.
                  </h1>
                  <p
                    className="text-sm leading-6"
                    style={{ color: 'rgba(255,255,255,0.72)' }}
                  >
                    Entre para salvar favoritas, publicar com IA e fazer parte
                    da cozinha que valoriza olhômetro e grama.
                  </p>
                </div>
              </div>

              <div
                className="rounded-[var(--radius-md)] p-5"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.14)',
                }}
              >
                <p
                  className="text-[0.78rem] font-bold uppercase"
                  style={{
                    color: 'var(--food-accent)',
                    letterSpacing: '0.08em',
                  }}
                >
                  Feito por quem cozinha
                </p>
                <p
                  className="mt-1 text-sm leading-5"
                  style={{ color: 'rgba(255,255,255,0.76)' }}
                >
                  Escreva como faz em casa. A IA confere utensílios, tempo e
                  nutrição — você publica com confiança.
                </p>
              </div>
            </section>

            {/* Lado formulário — mesmo ritmo de home */}
            <section className="flex items-center justify-center bg-white">
              <div className="w-full max-w-md px-6 py-8 sm:px-8">
                <p className="eyebrow-queimando-panela">Queimando Panela</p>
                <h2
                  className="font-display text-2xl font-extrabold leading-none tracking-[-0.04em] text-balance"
                  style={{ color: 'var(--cocoa)' }}
                >
                  {title}
                </h2>
                <p className="section-copy mt-3 !text-sm">{description}</p>

                <div className="mt-8">{children}</div>

                <p
                  className="mt-8 border-t pt-6 text-sm"
                  style={{
                    borderColor: 'var(--line)',
                    color: 'var(--ink-muted)',
                  }}
                >
                  {footerText}{' '}
                  <Link
                    href={footerLinkHref}
                    className="font-bold underline decoration-2 underline-offset-4 transition-colors hover:opacity-80"
                    style={{
                      color: 'var(--cocoa)',
                      textDecorationColor: 'var(--food-accent)',
                    }}
                  >
                    {footerLinkLabel}
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
