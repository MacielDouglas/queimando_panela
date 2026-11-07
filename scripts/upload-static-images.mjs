/**
 * Publica as imagens editoriais em `<bucket>/static` no R2.
 *
 * Depois do upload, defina `NEXT_PUBLIC_R2_STATIC_BASE_URL` (ou use o
 * `R2_PUBLIC_URL` já existente) para que o app passe a apontar para o R2.
 *
 * Uso: bun run images:upload
 * Requer: R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *         R2_BUCKET_NAME e R2_PUBLIC_URL no ambiente.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const REQUIRED = [
  'R2_ENDPOINT',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL',
];

const missing = REQUIRED.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Variáveis ausentes: ${missing.join(', ')}`);
  process.exit(1);
}

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const publicDir = path.join(process.cwd(), 'public');
const publicUrl = process.env.R2_PUBLIC_URL.replace(/\/+$/, '');
const bucket = process.env.R2_BUCKET_NAME;

const files = [
  'images/hero-cozinha.webp',
  'images/ingredientes.webp',
  'images/prato-principal-chef.webp',
  'images/sobremesa.webp',
  'images/cafe-da-manha.webp',
  'images/refeicao-compartilhada.webp',
  'images/pattern.webp',
];

for (const file of files) {
  const body = await readFile(path.join(publicDir, file));
  const key = `static/${path.basename(file)}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  console.log(
    `✓ ${publicUrl}/${key}  (${(body.byteLength / 1024).toFixed(1)} KB)`,
  );
}

console.log(
  `\nUpload concluído. Configure NEXT_PUBLIC_R2_STATIC_BASE_URL=${publicUrl}`,
);
