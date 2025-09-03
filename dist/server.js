global.IS_STREAM_SERVER = true;
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import cors from "cors";
import express from "express";
import { randomUUID } from "node:crypto";
import { Logger } from "./utils/logger.js";
import { registerPrompts } from "./prompts/index.js";
import { registerTools } from "./tools/index.js";
const app = express();
app.use(express.json());
Logger.info("Initializing MCP Server");
const transports = {};
app.use(cors({
    origin: "*",
    exposedHeaders: ["Mcp-Session-Id"],
    allowedHeaders: [
        "Content-Type",
        "mcp-session-id",
        "EMAIL-USERNAME",
        "EMAIL-PASSWORD",
    ],
}));
app.get("/", (_req, res) => {
    res.type("html").send(`<!DOCTYPE html>
<html lang="es">
  <head><meta charset="utf-8"><title>MCP Server</title></head>
  <body>Servidor MCP corriendo. Endpoint: <code>POST /mcp</code></body>
</html>`);
});
app.get("/favicon.ico", (_req, res) => {
    res.status(204).end();
});
app.post("/mcp", async (req, res) => {
    const sessionId = req.headers["mcp-session-id"];
    let transport;
    if (sessionId && transports[sessionId]) {
        transport = transports[sessionId];
    }
    else if (!sessionId && isInitializeRequest(req.body)) {
        transport = new StreamableHTTPServerTransport({
            // enableDnsRebindingProtection: true,
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (_sessionId) => {
                transports[_sessionId] = transport;
            },
        });
        transport.onclose = () => {
            if (transport.sessionId) {
                delete transports[transport.sessionId];
            }
        };
        const server = new McpServer({
            name: "dummy-mcp",
            version: "1.0.0",
        });
        registerTools(server);
        registerPrompts(server);
        await server.connect(transport);
    }
    else {
        res.status(400).json({
            jsonrpc: "2.0",
            error: {
                code: -32000,
                message: "Bad Request: No valid session ID provided",
            },
            id: null,
        });
        return;
    }
    await transport.handleRequest(req, res, req.body);
});
app.post("/send-email", async (req, res) => {
    // Datos de ejemplo para autenticación y email
    const authEmail = {
        email: req.body.email || "usuario@ejemplo.com",
        password: req.body.password || "password123",
        clientType: req.body.clientType || "gmail",
        port: req.body.port || "993",
    };
    const emailData = {
        to: req.body.to || "destinatario@ejemplo.com",
        subject: req.body.subject || "Prueba desde backend",
        body: req.body.body || "Este es el contenido del correo.",
        tone: req.body.tone || "friendly",
    };
    // Instanciar EmailClient y enviar email
    try {
        const EmailClient = (await import("./models/email.js")).default;
        const client = new EmailClient(authEmail);
        const result = await client.sendEmail(emailData);
        res.json({ success: !!result, result });
    }
    catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        res.status(500).json({ success: false, error: errorMsg });
    }
});
app.post("/send-email-mpc", async (req, res) => {
    // Leer configuración de mpc.json
    const fs = await import("fs/promises");
    const mpcRaw = await fs.readFile("./mpc.json", "utf-8");
    const mpcConfig = JSON.parse(mpcRaw);
    // Usar los datos de la tool Send-Email
    const tool = mpcConfig.tools.find((t) => t.name === "Send-Email");
    if (!tool) {
        return res.status(400).json({ success: false, error: "Tool Send-Email not found in mpc.json" });
    }
    // Usar los datos del body si existen, si no los de mpc.json
    const emailData = {
        to: req.body.to || tool.input.to,
        subject: req.body.subject || tool.input.subject,
        body: req.body.body || tool.input.body,
        tone: req.body.tone || tool.input.tone,
        email: req.body.email || "usuario@ejemplo.com",
        password: req.body.password || "password123",
        clientType: req.body.clientType || "gmail",
        port: req.body.port || "993"
    };
    // Instanciar EmailClient y enviar email
    try {
        const EmailClient = (await import("./models/email.js")).default;
        const client = new EmailClient(emailData);
        const result = await client.sendEmail(emailData);
        res.json({ success: !!result, result });
    }
    catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        res.status(500).json({ success: false, error: errorMsg });
    }
});
const handleSessionRequest = async (req, res) => {
    const sessionId = req.headers["mcp-session-id"];
    if (!sessionId || !transports[sessionId]) {
        res.status(400).send("Invalid or missing session ID");
        return;
    }
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
};
app.get("/mcp", handleSessionRequest);
app.delete("/mcp", handleSessionRequest);
app.listen(5555, (error) => {
    if (error) {
        Logger.error("Failed to start MCP Server:", error);
        process.exit(1);
    }
    Logger.info("MCP Server: Listening on http://localhost:5555");
});
//# sourceMappingURL=server.js.map
