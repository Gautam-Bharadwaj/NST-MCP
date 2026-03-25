import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    const mcpTransport = new StdioClientTransport({
        command: 'npx',
        args: ['-y', '@newtonschool/newton-mcp'],
        env: process.env
    });
    const mcpClient = new Client({ name: "cli", version: "1" }, { capabilities: {} });
    await mcpClient.connect(mcpTransport);
    
    console.log("Calling get_upcoming_schedule...");
    const res1 = await mcpClient.callTool({ name: 'get_upcoming_schedule', arguments: {} });
    console.log("Schedule:\n", JSON.stringify(res1.content[0]?.text, null, 2));

    console.log("Calling get_open_assignments...");
    const res2 = await mcpClient.callTool({ name: 'get_open_assignments', arguments: {} });
    console.log("Assignments:\n", JSON.stringify(res2.content[0]?.text, null, 2));
    
    process.exit(0);
}
main().catch(console.error);
