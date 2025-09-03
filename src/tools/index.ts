import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

import { registerEmailTools } from "@/tools/email";

export function registerTools(server: McpServer) {
  registerEmailTools(server);
}
