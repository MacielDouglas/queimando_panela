import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { GoogleAuthButton } from '@/components/auth/google-auth-button';

describe('GoogleAuthButton', () => {
  it('renderiza o texto padrão', () => {
    render(<GoogleAuthButton onClick={vi.fn().mockResolvedValue(undefined)} />);

    expect(
      screen.getByRole('button', { name: /continuar com google/i }),
    ).toBeInTheDocument();
  });

  it('renderiza children customizado', () => {
    render(
      <GoogleAuthButton onClick={vi.fn().mockResolvedValue(undefined)}>
        Entrar com Google
      </GoogleAuthButton>,
    );

    expect(
      screen.getByRole('button', { name: /entrar com google/i }),
    ).toBeInTheDocument();
  });

  it('chama onClick ao clicar', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn().mockResolvedValue(undefined);

    render(<GoogleAuthButton onClick={onClick} />);

    await user.click(
      screen.getByRole('button', { name: /continuar com google/i }),
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
