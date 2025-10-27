import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs/promises';
import path from 'path';

// Check if R2 credentials are configured
const isR2Configured = () => {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
};

// Initialize S3 client for Cloudflare R2
let r2Client: S3Client | null = null;

if (isR2Configured()) {
  r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  console.log('✓ Cloudflare R2 storage configured');
} else {
  console.log('ℹ R2 not configured, using local storage');
}

export interface R2UploadResult {
  key: string;
  url?: string;
  bucket: string;
}

/**
 * Upload a file to Cloudflare R2
 */
export async function uploadToR2(
  filePath: string,
  key: string,
  contentType?: string
): Promise<R2UploadResult> {
  if (!r2Client || !isR2Configured()) {
    throw new Error('R2 storage is not configured');
  }

  const bucketName = process.env.R2_BUCKET_NAME!;
  const fileContent = await fs.readFile(filePath);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
    ContentType: contentType || 'application/octet-stream',
  });

  await r2Client.send(command);

  // Generate public URL if R2_PUBLIC_URL is set
  const publicUrl = process.env.R2_PUBLIC_URL
    ? `${process.env.R2_PUBLIC_URL}/${key}`
    : undefined;

  console.log(`✓ Uploaded to R2: ${key}`);

  return {
    key,
    url: publicUrl,
    bucket: bucketName,
  };
}

/**
 * Generate a presigned URL for downloading a file from R2
 */
export async function getR2DownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  if (!r2Client || !isR2Configured()) {
    throw new Error('R2 storage is not configured');
  }

  const bucketName = process.env.R2_BUCKET_NAME!;

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
  return signedUrl;
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  if (!r2Client || !isR2Configured()) {
    throw new Error('R2 storage is not configured');
  }

  const bucketName = process.env.R2_BUCKET_NAME!;

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await r2Client.send(command);
  console.log(`✓ Deleted from R2: ${key}`);
}

/**
 * Check if R2 is configured and available
 */
export function isR2Available(): boolean {
  return isR2Configured() && r2Client !== null;
}

/**
 * Get content type based on file extension
 */
export function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  };
  return contentTypes[ext] || 'application/octet-stream';
}
