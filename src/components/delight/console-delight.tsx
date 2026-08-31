'use client';

import { useEffect } from 'react';

export function ConsoleDelight() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const styleTitle =
      'color: #1b2920; background: #a85131; padding: 6px 10px; border-radius: 999px; font-weight: 800;';
    const styleBody = 'color: #3e4d42; font-style: italic;';
    // eslint-disable-next-line no-console
    console.log(
      '%cQueimando Panela',
      styleTitle,
      '\n%cPanela queimada é história bem contada. Obrigado por abrir o console — que tal publicar sua primeira receita? → /receitas/new',
      styleBody,
    );
  }, []);
  return null;
}
