import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ErrorPage from '@/app/error';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('ErrorPage', () => {
  const mockRetry = vi.fn();
  const error = new Error('Something went wrong');

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renderiza a mensagem de erro', () => {
    render(<ErrorPage error={error} unstable_retry={mockRetry} />);

    expect(screen.getByText(/Algo queimou na cozinha/i)).toBeInTheDocument();
  });

  it('renderiza a descrição do erro', () => {
    render(<ErrorPage error={error} unstable_retry={mockRetry} />);

    expect(screen.getByText(/Não foi possível carregar/i)).toBeInTheDocument();
  });

  it('chama unstable_retry ao clicar em "Tentar novamente"', async () => {
    const user = userEvent.setup();

    render(<ErrorPage error={error} unstable_retry={mockRetry} />);

    await user.click(screen.getByRole('button', { name: /tentar novamente/i }));

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('tem link para voltar ao início', () => {
    render(<ErrorPage error={error} unstable_retry={mockRetry} />);

    const link = screen.getByRole('link', { name: /voltar ao início/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('exibe o digest quando disponível', () => {
    const errorWithDigest = Object.assign(new Error('Failed'), {
      digest: 'abc-123',
    });

    render(<ErrorPage error={errorWithDigest} unstable_retry={mockRetry} />);

    expect(screen.getByText(/Erro: abc-123/)).toBeInTheDocument();
  });

  it('não exibe digest quando não disponível', () => {
    render(<ErrorPage error={error} unstable_retry={mockRetry} />);

    expect(screen.queryByText(/Erro:/)).not.toBeInTheDocument();
  });

  it('faz console.error do error', () => {
    render(<ErrorPage error={error} unstable_retry={mockRetry} />);

    expect(console.error).toHaveBeenCalledWith(error);
  });
});
