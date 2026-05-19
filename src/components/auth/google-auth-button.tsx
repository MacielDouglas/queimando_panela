'use client';

import { Button } from '@/components/ui/button';

type GoogleAuthButtonProps = {
  onClick: () => Promise<void>;
  children?: React.ReactNode;
};

export function GoogleAuthButton({
  onClick,
  children = 'Continuar com Google',
}: GoogleAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="w-full border-amber-200 bg-white/80 backdrop-blur transition-all hover:border-amber-500 hover:bg-amber-50"
    >
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M21.8 10.2h-9.6v3.9h5.5c-.2 1.3-.9 2.4-2 3.2v2.7h3.2c1.9-1.8 2.9-4.4 2.9-7.5c0-.7-.1-1.5-.2-2.3z"
        />
        <path
          fill="currentColor"
          d="M12.2 22c2.7 0 5-1 6.7-2.7l-3.2-2.7c-.9.6-2.1 1-3.5 1c-2.7 0-5-1.8-5.8-4.3H3v2.8A10 10 0 0012.2 22z"
        />
        <path
          fill="currentColor"
          d="M6.4 13.3a6.2 6.2 0 010-4V6.5H3a10 10 0 000 9.1z"
        />
        <path
          fill="currentColor"
          d="M12.2 6.4c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17.2 3.6 14.9 2.7 12.2 2.7A10 10 0 003 6.5l3.4 2.8c.8-2.5 3.1-4.3 5.8-4.3z"
        />
      </svg>

      {children}
    </Button>
  );
}
