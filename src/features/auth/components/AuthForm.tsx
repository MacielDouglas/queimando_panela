'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type SyntheticEvent, useId, useState } from 'react';

import { authClient } from '@/lib/auth-client';

import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  mode: AuthMode;
}

// ─── Variantes de animação ────────────────────────────────────────────────────

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 28, stiffness: 260 },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15, ease: [0.4, 0, 1, 1] },
  },
};

const formContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

// ─── Componente principal ─────────────────────────────────────────────────────

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();

  const isLogin = mode === 'login';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault();
    setFormError(null);

    if (password.length < 8) {
      setFormError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const result = await authClient.signIn.email({
          email,
          password,
          callbackURL: '/',
        });
        if (result.error) {
          setFormError(result.error.message ?? 'Não foi possível entrar.');
          return;
        }
      } else {
        const result = await authClient.signUp.email({ name, email, password });
        if (result.error) {
          setFormError(
            result.error.message ?? 'Não foi possível criar a conta.',
          );
          return;
        }
      }

      router.replace('/');
      router.refresh();
    } catch {
      setFormError(
        isLogin
          ? 'Erro inesperado ao tentar entrar.'
          : 'Erro inesperado ao criar conta.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleAuth() {
    setFormError(null);
    try {
      const result = await authClient.signIn.social({ provider: 'google' });
      if (result?.error) {
        setFormError(
          result.error.message ?? 'Não foi possível autenticar com Google.',
        );
      }
    } catch {
      setFormError('Erro inesperado ao usar Google.');
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-md space-y-6 rounded-none">
      <AnimatePresence mode="wait" initial={false}>
        <motion.form
          key={mode}
          onSubmit={handleSubmit}
          noValidate
          aria-describedby={formError ? errorId : undefined}
          variants={formContainerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="space-y-5"
        >
          <FieldGroup>
            {/* Campo Nome — exclusivo do signup */}
            <AnimatePresence initial={false}>
              {!isLogin && (
                <motion.div
                  key="name-field"
                  variants={fieldVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <Field>
                    <FieldLabel htmlFor={nameId}>Nome</FieldLabel>
                    <FieldContent>
                      <Input
                        id={nameId}
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                        className="rounded-none border-neutral-200 bg-white/70 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
                      />
                    </FieldContent>
                    <FieldDescription>
                      Esse nome será exibido no seu perfil.
                    </FieldDescription>
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Campo E-mail */}
            <motion.div key="email-field" variants={fieldVariants}>
              <Field>
                <FieldLabel htmlFor={emailId}>E-mail</FieldLabel>
                <FieldContent>
                  <Input
                    id={emailId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    className="rounded-none border-neutral-200 bg-white/70 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
                  />
                </FieldContent>
                {isLogin && (
                  <FieldDescription>
                    Utilize o e-mail cadastrado.
                  </FieldDescription>
                )}
              </Field>
            </motion.div>

            {/* Campo Senha */}
            <motion.div key="password-field" variants={fieldVariants}>
              <Field>
                {isLogin ? (
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={passwordId}>Senha</FieldLabel>
                    <Link
                      href="/recuperar-senha"
                      className="text-xs text-neutral-500 transition-colors hover:text-amber-500 focus-visible:outline-amber-500"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                ) : (
                  <FieldLabel htmlFor={passwordId}>Senha</FieldLabel>
                )}
                <FieldContent>
                  <Input
                    id={passwordId}
                    name="password"
                    type="password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-none border-neutral-200 bg-white/70 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
                  />
                </FieldContent>
                {!isLogin && (
                  <FieldDescription>
                    Utilize pelo menos 8 caracteres.
                  </FieldDescription>
                )}
              </Field>
            </motion.div>

            {/* Erro do formulário */}
            <AnimatePresence initial={false}>
              {formError && (
                <motion.div
                  key="form-error"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <FieldError id={errorId} role="alert">
                    {formError}
                  </FieldError>
                </motion.div>
              )}
            </AnimatePresence>
          </FieldGroup>

          {/* Botão de submit */}
          <motion.div variants={fieldVariants}>
            <Button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="h-11 w-full rounded-none bg-amber-500 font-semibold text-neutral-950 transition-all duration-200 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-60"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isSubmitting ? 'loading' : 'idle'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isSubmitting
                    ? isLogin
                      ? 'Entrando…'
                      : 'Criando conta…'
                    : isLogin
                      ? 'Entrar'
                      : 'Criar conta'}
                </motion.span>
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.form>
      </AnimatePresence>

      {/* Divisor */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs tracking-[0.2em] text-neutral-500 uppercase">
          ou
        </span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      {/* Botão Google */}
      <GoogleAuthButton onClick={handleGoogleAuth} />

      {/* Link de alternância */}
      <p className="text-center text-sm text-neutral-600">
        {isLogin ? (
          <>
            Não tem conta?{' '}
            <Link
              href="/criar-conta"
              className="font-semibold text-amber-700 transition-colors hover:text-amber-500 focus-visible:outline-amber-500"
            >
              Criar conta
            </Link>
          </>
        ) : (
          <>
            Já tem conta?{' '}
            <Link
              href="/login"
              className="font-semibold text-amber-700 transition-colors hover:text-amber-500 focus-visible:outline-amber-500"
            >
              Entrar
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
