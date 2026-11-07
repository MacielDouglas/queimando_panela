/**
 * Gera as versões WebP das imagens editoriais em `public/images`.
 *
 * P0: essas imagens são publicadas no R2 e servidas direto de lá
 * (sem `/_next/image`). O WebP local fica como fallback de
 * desenvolvimento/build.
 *
 * Uso: bun run images:optimize
 */
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public');

const jobs = [
  {
    input: 'images/hero-cozinha.jpg',
    output: 'images/hero-cozinha.webp',
    width: 1200,
    quality: 78,
  },
  {
    input: 'images/ingredientes.jpg',
    output: 'images/ingredientes.webp',
    width: 1200,
    quality: 78,
  },
  {
    input: 'images/prato-principal-chef.jpg',
    output: 'images/prato-principal-chef.webp',
    width: 1000,
    quality: 78,
  },
  {
    input: 'images/sobremesa.jpg',
    output: 'images/sobremesa.webp',
    width: 1000,
    quality: 78,
  },
  {
    input: 'images/cafe-da-manha.jpg',
    output: 'images/cafe-da-manha.webp',
    width: 800,
    quality: 75,
  },
  {
    input: 'images/refeicao-compartilhada.jpg',
    output: 'images/refeicao-compartilhada.webp',
    width: 1000,
    quality: 78,
  },
  {
    input: 'pattern.jpg',
    output: 'images/pattern.webp',
    width: null,
    quality: 80,
  },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

let totalIn = 0;
let totalOut = 0;

for (const job of jobs) {
  const inputPath = path.join(publicDir, job.input);
  const outputPath = path.join(publicDir, job.output);

  const inputStat = await stat(inputPath);

  let pipeline = sharp(inputPath).rotate();
  if (job.width) {
    pipeline = pipeline.resize(job.width, null, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const buffer = await pipeline
    .webp({ quality: job.quality, effort: 5 })
    .toBuffer();

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buffer);

  totalIn += inputStat.size;
  totalOut += buffer.byteLength;

  const reduction = (1 - buffer.byteLength / inputStat.size) * 100;
  console.log(
    `${job.output.padEnd(42)} ${kb(inputStat.size).padStart(9)} -> ${kb(buffer.byteLength).padStart(9)}  (-${reduction.toFixed(0)}%)`,
  );
}

console.log(
  `\nTotal: ${kb(totalIn)} -> ${kb(totalOut)} (-${((1 - totalOut / totalIn) * 100).toFixed(0)}%)`,
);
