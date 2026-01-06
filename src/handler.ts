import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import type { Request, Response } from 'express'
import logger from './logger'
import { createMcpServer } from './mcp'

// 导入工具定义以注册 MCP 工具
import './oss'
import './tool-definations'

/**
 * 处理 MCP POST 请求
 * 在无状态模式下，每个请求创建独立的 transport 和 server 实例
 */
export async function handleMcpPost(req: Request, res: Response) {
  try {
    const server = createMcpServer()
    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    })
    res.on('close', () => {
      console.log('Request closed')
      transport.close()
      server.close()
    })
    await server.connect(transport)
    await transport.handleRequest(req, res, req.body)
  } catch (error) {
    console.error('Error handling MCP request:', error)
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      })
    }
  }
}

/**
 * 处理不允许的 HTTP 方法
 */
export function handleMethodNotAllowed(_req: Request, res: Response) {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Method not allowed.',
      },
      id: null,
    }),
  )
}

/**
 * 访问日志中间件
 */
export function accessLogMiddleware(req: Request, res: Response, next: () => void) {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info('access-log', {
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      body: req.body,
      ip: req.ip,
      status: res.statusCode,
      duration: `${duration}ms`,
    })
  })
  next()
}

