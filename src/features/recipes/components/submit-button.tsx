'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md bg-amber-500 px-5 py-3 text-sm font-medium text-stone-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Salvando...' : 'Salvar receita'}
    </button>
  );
}
