import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

import { registerEmailPrompts } from "@/prompts/email";

export function registerPrompts(server: McpServer) {
  registerEmailPrompts(server);
}
