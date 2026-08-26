import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const s3ClientMock = vi.fn();
const sendMock = vi.fn();

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(
    class {
      config: unknown;
      constructor(config: unknown) {
        this.config = config;
        s3ClientMock(config);
      }
      send = sendMock;
    },
  ),
}));

const ORIGINAL_ENV = { ...process.env };

describe('lib/r2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
    vi.clearAllMocks();
  });

  it('lança erro quando R2_ENDPOINT não está definido ao usar o cliente', async () => {
    delete process.env.R2_ENDPOINT;
    process.env.R2_ACCESS_KEY_ID = 'key';
    process.env.R2_SECRET_ACCESS_KEY = 'secret';
    process.env.R2_BUCKET_NAME = 'bucket';
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com';

    const mod = await import('@/lib/r2');

    expect(() => mod.r2.send({} as never)).toThrow(
      'Missing required env var: R2_ENDPOINT',
    );
  });

  it('lança erro quando R2_ACCESS_KEY_ID não está definido', async () => {
    process.env.R2_ENDPOINT = 'https://account.r2.cloudflarestorage.com';
    delete process.env.R2_ACCESS_KEY_ID;
    process.env.R2_SECRET_ACCESS_KEY = 'secret';
    process.env.R2_BUCKET_NAME = 'bucket';
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com';

    const mod = await import('@/lib/r2');

    expect(() => mod.r2.send({} as never)).toThrow(
      'Missing required env var: R2_ACCESS_KEY_ID',
    );
  });

  it('lança erro quando R2_SECRET_ACCESS_KEY não está definido', async () => {
    process.env.R2_ENDPOINT = 'https://account.r2.cloudflarestorage.com';
    process.env.R2_ACCESS_KEY_ID = 'key';
    delete process.env.R2_SECRET_ACCESS_KEY;
    process.env.R2_BUCKET_NAME = 'bucket';
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com';

    const mod = await import('@/lib/r2');

    expect(() => mod.r2.send({} as never)).toThrow(
      'Missing required env var: R2_SECRET_ACCESS_KEY',
    );
  });

  it('getR2BucketName retorna nome do bucket e lança quando ausente', async () => {
    process.env.R2_BUCKET_NAME = 'meu-bucket';
    process.env.R2_ENDPOINT = 'https://endpoint';
    process.env.R2_ACCESS_KEY_ID = 'key';
    process.env.R2_SECRET_ACCESS_KEY = 'secret';
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com';

    const mod = await import('@/lib/r2');
    expect(mod.getR2BucketName()).toBe('meu-bucket');

    // troca para ausente precisa reimportar
    vi.resetModules();
    delete process.env.R2_BUCKET_NAME;
    const mod2 = await import('@/lib/r2');
    expect(() => mod2.getR2BucketName()).toThrow(
      'Missing required env var: R2_BUCKET_NAME',
    );
  });

  it('getR2PublicUrl retorna URL correta sem barras finais', async () => {
    process.env.R2_ENDPOINT = 'https://account.r2.cloudflarestorage.com';
    process.env.R2_ACCESS_KEY_ID = 'key';
    process.env.R2_SECRET_ACCESS_KEY = 'secret';
    process.env.R2_BUCKET_NAME = 'bucket';
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com///';

    const mod = await import('@/lib/r2');

    expect(mod.getR2PublicUrl()).toBe('https://cdn.example.com');
  });

  it('getR2PublicUrl preserva URL sem barra final e remove múltiplas barras', async () => {
    vi.resetModules();
    process.env.R2_ENDPOINT = 'https://endpoint';
    process.env.R2_ACCESS_KEY_ID = 'key';
    process.env.R2_SECRET_ACCESS_KEY = 'secret';
    process.env.R2_BUCKET_NAME = 'bucket';
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com';

    const mod = await import('@/lib/r2');
    expect(mod.getR2PublicUrl()).toBe('https://cdn.example.com');

    vi.resetModules();
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com/';
    const mod2 = await import('@/lib/r2');
    expect(mod2.getR2PublicUrl()).toBe('https://cdn.example.com');
  });

  it('getR2PublicUrl lança quando R2_PUBLIC_URL ausente', async () => {
    vi.resetModules();
    process.env.R2_ENDPOINT = 'https://endpoint';
    process.env.R2_ACCESS_KEY_ID = 'key';
    process.env.R2_SECRET_ACCESS_KEY = 'secret';
    process.env.R2_BUCKET_NAME = 'bucket';
    delete process.env.R2_PUBLIC_URL;

    const mod = await import('@/lib/r2');
    expect(() => mod.getR2PublicUrl()).toThrow(
      'Missing required env var: R2_PUBLIC_URL',
    );
  });

  it('cria cliente lazy e exporta bucket/public url quando envs existem (getR2Bucket via r2.send)', async () => {
    process.env.R2_ENDPOINT = 'https://account.r2.cloudflarestorage.com';
    process.env.R2_ACCESS_KEY_ID = 'key';
    process.env.R2_SECRET_ACCESS_KEY = 'secret';
    process.env.R2_BUCKET_NAME = 'bucket';
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com///';

    const mod = await import('@/lib/r2');

    // cliente só é criado no primeiro uso
    expect(s3ClientMock).not.toHaveBeenCalled();

    await mod.r2.send({} as never);

    expect(s3ClientMock).toHaveBeenCalledWith({
      region: 'auto',
      endpoint: 'https://account.r2.cloudflarestorage.com',
      credentials: {
        accessKeyId: 'key',
        secretAccessKey: 'secret',
      },
    });
    expect(sendMock).toHaveBeenCalled();

    expect(mod.getR2BucketName()).toBe('bucket');
    expect(mod.getR2PublicUrl()).toBe('https://cdn.example.com');
  });

  it('reutiliza cliente em cache (não cria novo S3Client no segundo send)', async () => {
    process.env.R2_ENDPOINT = 'https://account.r2.cloudflarestorage.com';
    process.env.R2_ACCESS_KEY_ID = 'key';
    process.env.R2_SECRET_ACCESS_KEY = 'secret';
    process.env.R2_BUCKET_NAME = 'bucket';
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com';

    const mod = await import('@/lib/r2');

    await mod.r2.send({ input: 1 } as never);
    await mod.r2.send({ input: 2 } as never);

    // S3Client deve ter sido instanciado apenas uma vez
    expect(s3ClientMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(2);
  });

  it('r2.send delega para S3Client.send com o comando correto', async () => {
    process.env.R2_ENDPOINT = 'https://endpoint';
    process.env.R2_ACCESS_KEY_ID = 'key';
    process.env.R2_SECRET_ACCESS_KEY = 'secret';
    process.env.R2_BUCKET_NAME = 'bucket';
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com';
    sendMock.mockResolvedValueOnce({ success: true });

    const mod = await import('@/lib/r2');
    const fakeCommand = { Bucket: 'bucket', Key: 'file.jpg' };
    const result = await mod.r2.send(fakeCommand as never);

    expect(sendMock).toHaveBeenCalledWith(fakeCommand);
    expect(result).toEqual({ success: true });
  });
});
