import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { Express } from 'express';
import { getLocalProductImageUrl, getUploadDriver, type UploadDriver } from '../config/upload';

export type StoredProductImage = {
  imageUrl: string;
  imageStorage: UploadDriver;
};

function buildS3Client() {
  const region = process.env.AWS_REGION;

  if (!region) {
    throw new Error('Defina AWS_REGION para usar o upload no S3.');
  }

  return new S3Client({ region, credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  } 
   });
}

function buildS3PublicUrl(bucket: string, region: string, key: string) {
  const publicBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL;

  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, '')}/${key}`;
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

function sanitizeBaseName(fileName: string) {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export async function uploadProductImageToS3(file: Express.Multer.File): Promise<StoredProductImage> {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;

  if (!bucket || !region) {
    throw new Error('Defina AWS_S3_BUCKET e AWS_REGION para usar o upload no S3.');
  }

  if (!file.buffer) {
    throw new Error('O arquivo precisa estar em memoria para ser enviado ao S3.');
  }

  const key = `products/${Date.now()}-${sanitizeBaseName(file.originalname)}`;
  const s3Client = buildS3Client();

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return {
    imageUrl: buildS3PublicUrl(bucket, region, key),
    imageStorage: 's3',
  };
}

export async function storeProductImage(file?: Express.Multer.File): Promise<StoredProductImage | null> {
  if (!file) {
    return null;
  }

  const uploadDriver = getUploadDriver();

  if (uploadDriver === 's3') {
    return uploadProductImageToS3(file);
  }

  return {
    imageUrl: getLocalProductImageUrl(file),
    imageStorage: 'local',
  };
}
