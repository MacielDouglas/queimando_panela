import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Loading from '@/app/(public)/receitas/loading';

describe('Recipe Detail Loading (slug)', () => {
  it('renderiza skeleton principal', () => {
    const { container } = render(<Loading />);
    expect(container.querySelector('main')).toBeInTheDocument();
  });

  it('renderiza blocos de skeleton', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('contém elementos com animação pulse', () => {
    const { container } = render(<Loading />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
      0,
    );
  });
});
