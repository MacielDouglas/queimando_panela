import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home', () => {
  it('renderiza o título principal "Queimando Panela"', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', { name: /Queimando Panela/i }),
    ).toBeInTheDocument();
  });

  it('renderiza o subtítulo explicando o blog', () => {
    render(<Home />);

    expect(
      screen.getByText(/Estamos terminando de cozinhar o blog/i),
    ).toBeInTheDocument();
  });

  it('mostra o trecho "Receita do dia" e "Bolo de Cenoura"', () => {
    render(<Home />);

    expect(screen.getByText(/Receita do dia/i)).toBeInTheDocument();
    expect(screen.getByText(/Bolo de Cenoura/i)).toBeInTheDocument();
  });
});
