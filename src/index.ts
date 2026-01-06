import express from 'express'
import logger from './logger'
import { accessLogMiddleware, handleMcpPost, handleMethodNotAllowed } from './handler'

/**
 * 本地开发服务器入口
 * 在 Vercel 部署时使用 api/mcp.ts
 */
const app = express()
const port = process.env.PORT || 18900

app.use(express.json())
app.use(accessLogMiddleware)

app.post('/mcp', handleMcpPost)
app.get('/mcp', handleMethodNotAllowed)
app.delete('/mcp', handleMethodNotAllowed)

app.listen(port, () => {
  logger.info(`Server listening at http://localhost:${port}`)
})
