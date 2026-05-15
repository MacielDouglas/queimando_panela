import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/lib/env';

const R2_KEY_PREFIX = 'my-projects';

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '');
}

function normalizeObjectKey(key: string) {
  return key.replace(/^\/+/, '').replace(/\/{2,}/g, '/');
}

function withR2Prefix(key: string) {
  const normalizedKey = normalizeObjectKey(key);

  if (normalizedKey.startsWith(`${R2_KEY_PREFIX}/`)) {
    return normalizedKey;
  }

  return `${R2_KEY_PREFIX}/${normalizedKey}`;
}

export function buildR2PublicUrl(key: string) {
  return `${normalizeBaseUrl(env.R2_PUBLIC_URL)}/${normalizeObjectKey(key)}`;
}

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

type UploadObjectToR2Input = {
  key: string;
  body: Buffer;
  contentType: string;
  cacheControl?: string;
};

export async function uploadObjectToR2(input: UploadObjectToR2Input) {
  const key = withR2Prefix(input.key);

  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: input.cacheControl ?? 'public, max-age=31536000, immutable',
    }),
  );

  return {
    key,
    url: buildR2PublicUrl(key),
  };
}

export async function deleteObjectFromR2(key: string) {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: normalizeObjectKey(key),
    }),
  );
}
