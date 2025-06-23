import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import express from 'express'
import 'source-map-support/register'
import logger from './logger'
import { createMcpServer } from './mcp'

import './oss'
import './tool-definations'

const app = express()
const port = process.env.PORT || 18900

app.use(express.json())

app.use((req, res, next) => {
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
})

app.post('/mcp', async (req, res) => {
  // In stateless mode, create a new instance of transport and server for each request
  // to ensure complete isolation. A single instance would cause request ID collisions
  // when multiple clients connect concurrently.

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
})

app.get('/mcp', async (_req, res) => {
  console.log('Received GET MCP request')
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
})

app.delete('/mcp', async (_req, res) => {
  console.log('Received DELETE MCP request')
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
})

app.listen(port, () => {
  logger.info(`Server listening at http://localhost:${port}`)
})
