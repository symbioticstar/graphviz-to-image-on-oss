import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, OSS_BUCKET, OSS_ENDPOINT, OSS_ENDPOINT_DISPLAY_HOST } from './config'
import logger from './logger'

const s3 = new S3Client({
  region: 'oss-cn-hangzhou',
  endpoint: OSS_ENDPOINT,
  credentials: {
    accessKeyId: OSS_ACCESS_KEY_ID,
    secretAccessKey: OSS_ACCESS_KEY_SECRET,
  },
  forcePathStyle: false,
})

function mask(str: string): string {
  if (!str) {
    return ''
  }
  return str.length > 20 ? `${str.slice(0, 3)}****${str.slice(-3)}` : str
}

logger.info('OSS Config:', {
  endpoint: OSS_ENDPOINT,
  bucket: OSS_BUCKET,
  accessKeyId: mask(OSS_ACCESS_KEY_ID),
  secretAccessKey: mask(OSS_ACCESS_KEY_SECRET),
})

async function uploadToOSS(objectKey: string, imageBuffer: Buffer | Uint8Array) {
  const buf = Buffer.isBuffer(imageBuffer) ? imageBuffer : Buffer.from(imageBuffer)
  const cmd = new PutObjectCommand({
    Bucket: OSS_BUCKET,
    Key: objectKey,
    Body: buf,
    ContentType: 'image/svg+xml',
    ACL: 'public-read',
  })
  await s3.send(cmd)
  return `https://${OSS_BUCKET}.${OSS_ENDPOINT_DISPLAY_HOST}/${objectKey}`
}

export async function uploadSvgToOSS(objectKey: string, svg: string) {
  const buffer = Buffer.from(svg, 'utf-8')
  return await uploadToOSS(objectKey, buffer)
}
