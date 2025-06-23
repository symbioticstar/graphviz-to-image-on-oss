import path from 'path'
import { createLogger, format, transports } from 'winston'

function getFileLine(stackOffset = 2) {
  const stack = new Error().stack
  if (!stack) return ''
  const stackLines = stack.split('\n')
  // stackOffset=2: 跳过 getFileLine 和 logWithFileLine
  let callerLine = stackLines[stackOffset + 1] || ''
  const match = callerLine.match(/\(([^)]+):(\d+):(\d+)\)/)
  if (match) {
    const filePath = match[1]
    const fileName = path.basename(filePath)
    const line = match[2]
    return `${fileName}:${line}`
  }
  return ''
}

const baseLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`),
  ),
  transports: [new transports.Console()],
})

function formatMsg(args: any[]): string {
  return args.map((arg) => (typeof arg === 'string' ? arg : arg instanceof Error ? arg.stack || arg.message : JSON.stringify(arg))).join(' ')
}

function logWithFileLine(level: string, ...args: any[]) {
  const fileLine = getFileLine(3) // 3: 跳过 logWithFileLine、logger.info/error/warn、调用方
  const msg = formatMsg(args)
  baseLogger.log({ level: String(level), message: `[${fileLine}]: ${msg}` })
}

const logger = {
  info: (...args: any[]) => logWithFileLine('info', ...args),
  error: (...args: any[]) => logWithFileLine('error', ...args),
  warn: (...args: any[]) => logWithFileLine('warn', ...args),
  // 需要可以扩展更多级别
}

export default logger
