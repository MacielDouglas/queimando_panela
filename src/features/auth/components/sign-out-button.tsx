"use client";

import { useSignOut } from "../hooks/use-sign-out";

export function SignOutButton() {
  const { signOut, isSigningOut, error } = useSignOut();

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={signOut}
        disabled={isSigningOut}
        className="inline-flex w-full items-center justify-center  border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSigningOut ? "Saindo…" : "Sair"}
      </button>

      {error && (
        <p className="text-[11px] text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
