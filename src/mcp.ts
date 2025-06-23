import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

const _mcpServer = {} as McpServer

const registeredActions = [] as Array<(tar: McpServer) => void>

export function createMcpServer() {
  const mcpServer = new McpServer({
    name: 'graphviz-to-image-on-oss',
    version: '1.0.0',
  })

  registeredActions.forEach((fn) => {
    fn(mcpServer)
  })

  return mcpServer
}

export const mcpServerRegistrar = new Proxy(_mcpServer, {
  get(target: McpServer, p: string | symbol): any {
    // store all actions as lambdas to registeredActions
    return (...args: any[]) => {
      // no real interactinos to target, only store actions
      const fn = (tar: McpServer) => {
        ;(tar[p as keyof McpServer] as (...args: any[]) => any).call(tar, ...args)
      }
      registeredActions.push(fn)
      return fn
    }
  },
})

export const mcpServer = mcpServerRegistrar

function wrapper(text: any): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text: typeof text === 'string' ? text : JSON.stringify(text),
      },
    ],
  }
}

export const singularMcpResponse = {
  rawText: wrapper,
}
