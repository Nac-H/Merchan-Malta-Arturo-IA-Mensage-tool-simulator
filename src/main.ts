#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerPrompts } from "@/prompts";
import { registerTools } from "@/tools";

const server = new McpServer({
  name: "email-management-mcp",
  version: "3.1.2",
});

registerTools(server);
registerPrompts(server);

const transport = new StdioServerTransport();

await server.connect(transport).catch((error) => {
  console.error("Failed to connect server:", error);
  process.exit(1);
});
