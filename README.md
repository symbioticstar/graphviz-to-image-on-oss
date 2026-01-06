# graphviz-to-image-on-oss

Convert Graphviz DOT code to SVG images, upload them to Alibaba Cloud OSS, and return the image link.

## Features
- HTTP API to convert Graphviz DOT to SVG images.
- Automatically uploads images to OSS and returns a public link.
- Supports integration with Model Context Protocol (MCP) tools.
- Deployable on Vercel as Serverless Functions.

## Requirements
- Node.js 22+
- Alibaba Cloud OSS account (with required environment variables configured)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OSS_ENDPOINT` | OSS endpoint (e.g., `https://oss-cn-hangzhou.aliyuncs.com`) | Yes |
| `OSS_ENDPOINT_DISPLAY` | OSS display endpoint for generating public URLs | No (defaults to `OSS_ENDPOINT`) |
| `OSS_ACCESS_KEY_ID` | OSS Access Key ID | Yes |
| `OSS_ACCESS_KEY_SECRET` | OSS Access Key Secret | Yes |
| `OSS_BUCKET` | OSS Bucket name | Yes |

## Deployment

### Deploy to Vercel (Recommended)

1. Fork or clone this repository.

2. Install the Vercel CLI:

```bash
npm i -g vercel
```

3. Deploy to Vercel:

```bash
vercel
```

4. Configure environment variables in Vercel Dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all required OSS environment variables

5. Your MCP endpoint will be available at:
   - `https://your-project.vercel.app/mcp`

### Local Development

1. Install dependencies:

```bash
pnpm install
```

2. Set environment variables (export them in your shell or use a `.env` file with a tool like `dotenv-cli`):

```bash
export OSS_ENDPOINT=xxx
export OSS_ENDPOINT_DISPLAY=xxx
export OSS_ACCESS_KEY_ID=xxx
export OSS_ACCESS_KEY_SECRET=xxx
export OSS_BUCKET=xxx
```

3. Build the project:

```bash
pnpm build
```

4. Start the local development server:

```bash
pnpm dev
```

The default port is 18900. You can customize it via the `PORT` environment variable.

### Local Development with Vercel CLI

For a more accurate local development experience that simulates Vercel's environment:

```bash
vercel dev
```

## API Usage

### POST /mcp

Request body (JSON):
```json
{
  "tool": "graphviz-to-image",
  "params": {
    "graphvizDsl": "digraph { a -> b }"
  }
}
```

Response:
- Success: OSS link to the SVG image
- Failure: Error message

## Main Dependencies
- [@hpcc-js/wasm-graphviz](https://www.npmjs.com/package/@hpcc-js/wasm-graphviz) for DOT to SVG conversion
- [@aws-sdk/client-s3](https://www.npmjs.com/package/@aws-sdk/client-s3) (compatible with Alibaba Cloud OSS)
- [express](https://expressjs.com/) for HTTP service
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) for MCP protocol support

## Development Scripts
- `pnpm build`: Compile TypeScript source code
- `pnpm dev`: Start the local development server
- `pnpm lint`: Lint code style
- `pnpm format`: Auto-format code

## Project Structure

```
├── api/                  # Vercel Serverless Functions
│   └── mcp.ts           # MCP endpoint handler
├── src/                  # Core source code
│   ├── config.ts        # Environment configuration
│   ├── handler.ts       # Express request handlers
│   ├── index.ts         # Local development server entry
│   ├── logger.ts        # Winston logger setup
│   ├── mcp.ts           # MCP server factory
│   ├── oss.ts           # Alibaba Cloud OSS upload logic
│   └── tool-definations.ts  # MCP tool definitions
├── vercel.json          # Vercel configuration
└── package.json
```

## License
MIT
