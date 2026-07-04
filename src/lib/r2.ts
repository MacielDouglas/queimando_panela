import { S3Client } from "@aws-sdk/client-s3";
import { envServer } from "./env/env.server";

export const r2 = new S3Client({
  region: "auto",
  endpoint: envServer.R2_ENDPOINT,
  credentials: {
    accessKeyId: envServer.R2_ACCESS_KEY_ID,
    secretAccessKey: envServer.R2_SECRET_ACCESS_KEY,
  },
});

export const R2_BUCKET_NAME = envServer.R2_BUCKET_NAME;
export const R2_PUBLIC_URL = envServer.R2_PUBLIC_URL.replace(/\/+$/, "");
