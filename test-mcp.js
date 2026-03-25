import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    console.log("Connecting...");
    const mcpTransport = new StdioClientTransport({
        command: 'npx',
        args: ['-y', '@newtonschool/newton-mcp'],
        env: process.env
    });
    const mcpClient = new Client({ name: "cli", version: "1" }, { capabilities: {} });
    await mcpClient.connect(mcpTransport);
    const tools = await mcpClient.listTools();
    console.log("Tools:", JSON.stringify(tools.tools, null, 2));
    process.exit(0);
}
main().catch(console.error);
