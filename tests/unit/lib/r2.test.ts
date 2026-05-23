import { afterEach, describe, expect, it, vi } from 'vitest';

const s3ClientMock = vi.fn();

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(
    class {
      config: unknown;

      constructor(config: unknown) {
        this.config = config;
        s3ClientMock(config);
      }
    },
  ),
}));

const ORIGINAL_ENV = { ...process.env };

describe('lib/r2', () => {
  afterEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
    vi.clearAllMocks();
  });

  it('lança erro quando R2_ENDPOINT não está definido', async () => {
    delete process.env.R2_ENDPOINT;
    process.env.R2_ACCESS_KEY_ID = 'key';
    process.env.R2_SECRET_ACCESS_KEY = 'secret';
    process.env.R2_BUCKET_NAME = 'bucket';
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com';

    await expect(import('@/lib/r2')).rejects.toThrow(
      'Missing required env var: R2_ENDPOINT',
    );
  });

  it('cria cliente e exporta bucket/public url quando envs existem', async () => {
    process.env.R2_ENDPOINT = 'https://account.r2.cloudflarestorage.com';
    process.env.R2_ACCESS_KEY_ID = 'key';
    process.env.R2_SECRET_ACCESS_KEY = 'secret';
    process.env.R2_BUCKET_NAME = 'bucket';
    process.env.R2_PUBLIC_URL = 'https://cdn.example.com///';

    const mod = await import('@/lib/r2');

    expect(s3ClientMock).toHaveBeenCalledWith({
      region: 'auto',
      endpoint: 'https://account.r2.cloudflarestorage.com',
      credentials: {
        accessKeyId: 'key',
        secretAccessKey: 'secret',
      },
    });

    expect(mod.R2_BUCKET_NAME).toBe('bucket');
    expect(mod.R2_PUBLIC_URL).toBe('https://cdn.example.com');
    expect(mod.r2).toBeInstanceOf(Object);
  });
});
