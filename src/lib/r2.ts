import { S3Client } from '@aws-sdk/client-s3';

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

let cachedClient: S3Client | null = null;

function getClient() {
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: 'auto',
      endpoint: requireEnv('R2_ENDPOINT'),
      credentials: {
        accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
        secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
      },
    });
  }
  return cachedClient;
}

/**
 * Lazy: o cliente S3 só é criado no primeiro uso em runtime,
 * nunca durante o build.
 */
export const r2 = {
  send<TCommand extends object>(command: TCommand) {
    return getClient().send(command as Parameters<S3Client['send']>[0]);
  },
};

export function getR2BucketName() {
  return requireEnv('R2_BUCKET_NAME');
}

export function getR2PublicUrl() {
  return requireEnv('R2_PUBLIC_URL').replace(/\/+$/, '');
}
