import { render, screen } from '@testing-library/react';
import type { ImageProps } from 'next/image';
import { describe, expect, it, vi } from 'vitest';

import { RecipeDetailHero } from '@/features/recipes/components/recipe-detail/RecipeDetailHero';

vi.mock('server-only', () => ({}));

vi.mock('@/lib/env/env.server', () => ({
  envServer: {
    BETTER_AUTH_SECRET: 'test',
    BETTER_AUTH_URL: 'http://localhost:3000',
    DATABASE_URL: 'postgresql://test',
    GOOGLE_CLIENT_ID: 'test',
    GOOGLE_CLIENT_SECRET: 'test',
    R2_ENDPOINT: 'https://test.r2.dev',
    R2_PUBLIC_URL: 'https://test.r2.dev',
    R2_ACCESS_KEY_ID: 'test',
    R2_SECRET_ACCESS_KEY: 'test',
    R2_BUCKET_NAME: 'test',
    RESEND_API_KEY: 'test',
    GROQ_API_KEY: 'test',
    NODE_ENV: 'test',
  },
}));

vi.mock('@/lib/r2', () => ({
  getR2Bucket: vi.fn(),
  getR2PublicUrl: vi.fn(() => 'https://test.r2.dev'),
}));

vi.mock('next/image', () => ({
  default: (props: ImageProps) => {
    return (
      <span
        data-testid="next-image"
        data-src={String(props.src)}
        data-alt={props.alt}
      />
    );
  },
}));

describe('RecipeDetailHero', () => {
  it('renderiza título, resumo e metadados', () => {
    render(
      <RecipeDetailHero
        slug="bolo-de-cenoura"
        title="Bolo de Cenoura"
        summary="Fofo"
        types={['Bolo']}
        difficulty="EASY"
        prepTimeMinutes={10}
        cookTimeMinutes={20}
        servings={8}
        coverUrl="/bolo.jpg"
        authorName="Douglas"
        story={null}
      />,
    );

    expect(screen.getByText('Bolo de Cenoura')).toBeInTheDocument();
    expect(screen.getByText('Fofo')).toBeInTheDocument();
    expect(screen.getByText('Bolo')).toBeInTheDocument();
    expect(screen.getByText('Fácil')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Douglas')).toBeInTheDocument();

    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('data-src', '/bolo.jpg');
    expect(image).toHaveAttribute('data-alt', 'Bolo de Cenoura');
  });
});
