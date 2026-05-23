import { S3Client } from '@aws-sdk/client-s3';

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const r2 = new S3Client({
  region: 'auto',
  endpoint: requireEnv('R2_ENDPOINT'),
  credentials: {
    accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
    secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
  },
});

export const R2_BUCKET_NAME = requireEnv('R2_BUCKET_NAME');
export const R2_PUBLIC_URL = requireEnv('R2_PUBLIC_URL').replace(/\/+$/, '');
