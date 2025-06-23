import z from 'zod'
import { mcpServer, singularMcpResponse } from './mcp'
import { Graphviz } from '@hpcc-js/wasm-graphviz'
import { uploadSvgToOSS } from './oss'
import moment from 'moment'
import { randomUUID } from 'crypto'

mcpServer.tool(
  'graphviz-to-image',
  'Convert Graphviz DOT to SVG. Return a link to the SVG image on OSS.',
  {
    graphvizDsl: z.string().describe('Graphviz DOT DSL'),
  },
  async ({ graphvizDsl }) => {
    try {
      console.log('Received Graphviz DSL length:', graphvizDsl.length)

      const graphviz = await Graphviz.load()
      const svg = graphviz.layout(graphvizDsl, 'svg', 'dot')
      const namespace = 'graphviz-images'
      const date = moment().format('YYYYMMDD')
      const objectKey = `${namespace}/${date}/${randomUUID()}.svg`
      console.log('Upload to OSS with object key:', objectKey)
      const uploadResult = await uploadSvgToOSS(objectKey, svg)
      return singularMcpResponse.rawText(uploadResult)
    } catch (error) {
      console.error('Error in graphviz-to-image:', error)
      return singularMcpResponse.rawText('Failed to convert Graphviz DOT to SVG.')
    }
  },
)
