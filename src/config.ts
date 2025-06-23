import dotenv from 'dotenv'

dotenv.config({
  path: '/Users/chenjingyu/ws/graphviz-to-image-on-oss/.env',
})

// OSS 相关环境变量
export const OSS_ENDPOINT = process.env.OSS_ENDPOINT || ''
export const OSS_ENDPOINT_DISPLAY_HOST = (process.env.OSS_ENDPOINT_DISPLAY || OSS_ENDPOINT).replace(/^(http|https):\/\//, '')
export const OSS_ACCESS_KEY_ID = process.env.OSS_ACCESS_KEY_ID || ''
export const OSS_ACCESS_KEY_SECRET = process.env.OSS_ACCESS_KEY_SECRET || ''
export const OSS_BUCKET = process.env.OSS_BUCKET || ''
