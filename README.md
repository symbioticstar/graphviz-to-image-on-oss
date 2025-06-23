# graphviz-to-image-on-oss

Convert Graphviz DOT code to SVG images, upload them to Alibaba Cloud OSS, and return the image link.

## Features
- HTTP API to convert Graphviz DOT to SVG images.
- Automatically uploads images to OSS and returns a public link.
- Supports integration with Model Context Protocol (MCP) tools.

## Requirements
- Node.js 22+
- Alibaba Cloud OSS account (with required environment variables configured)

## Installation & Usage

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables (create a `.env` file in the project root):

```env
OSS_ENDPOINT=xxx
OSS_ENDPOINT_DISPLAY=xxx
OSS_ACCESS_KEY_ID=xxx
OSS_ACCESS_KEY_SECRET=xxx
OSS_BUCKET=xxx
```

3. Build the project:

```bash
pnpm build
```

4. Start the service:

```bash
node dist/index.js
```

The default port is 18900. You can customize it via the `PORT` environment variable.

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
- `pnpm lint`: Lint code style
- `pnpm format`: Auto-format code

## License
MIT
