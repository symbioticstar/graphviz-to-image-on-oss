"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _streamableHttp = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
require("source-map-support/register");
const _logger = /*#__PURE__*/ _interop_require_default(require("../src/logger"));
const _mcp = require("../src/mcp");
require("../src/oss");
require("../src/tool-definations");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const app = (0, _express.default)();
const port = process.env.PORT || 18900;
app.use(_express.default.json());
app.use((req, res, next)=>{
    const start = Date.now();
    res.on('finish', ()=>{
        const duration = Date.now() - start;
        _logger.default.info('access-log', {
            method: req.method,
            url: req.originalUrl,
            query: req.query,
            body: req.body,
            ip: req.ip,
            status: res.statusCode,
            duration: `${duration}ms`
        });
    });
    next();
});
app.post('/mcp', async (req, res)=>{
    // In stateless mode, create a new instance of transport and server for each request
    // to ensure complete isolation. A single instance would cause request ID collisions
    // when multiple clients connect concurrently.
    try {
        const server = (0, _mcp.createMcpServer)();
        const transport = new _streamableHttp.StreamableHTTPServerTransport({
            sessionIdGenerator: undefined
        });
        res.on('close', ()=>{
            console.log('Request closed');
            transport.close();
            server.close();
        });
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error'
                },
                id: null
            });
        }
    }
});
app.get('/mcp', async (_req, res)=>{
    console.log('Received GET MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: '2.0',
        error: {
            code: -32000,
            message: 'Method not allowed.'
        },
        id: null
    }));
});
app.delete('/mcp', async (_req, res)=>{
    console.log('Received DELETE MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: '2.0',
        error: {
            code: -32000,
            message: 'Method not allowed.'
        },
        id: null
    }));
});
app.listen(port, ()=>{
    _logger.default.info(`Server listening at http://localhost:${port}`);
});
const _default = app;

//# sourceMappingURL=index.js.map