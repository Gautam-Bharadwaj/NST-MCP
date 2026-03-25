import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    const mcpTransport = new StdioClientTransport({
        command: 'npx',
        args: ['-y', '@newtonschool/newton-mcp'],
        env: process.env
    });
    const mcpClient = new Client({ name: "test", version: "1" }, { capabilities: {} });
    await mcpClient.connect(mcpTransport);
    
    const result = await mcpClient.callTool({
        name: 'get_assignments',
        arguments: {}
    });
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
}
main().catch(console.error);
