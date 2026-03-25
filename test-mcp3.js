import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    const transport = new StdioClientTransport({ command: 'npx', args: ['-y', '@newtonschool/newton-mcp'], env: process.env });
    const client = new Client({ name: "cli", version: "1" }, { capabilities: {} });
    await client.connect(transport);
    
    console.log("Calling...");
    const res = await client.callTool({ name: 'search_practice_questions', arguments: { limit: 2 } });
    console.log("Q:\n", JSON.stringify(res.content[0]?.text, null, 2));
    
    process.exit(0);
}
main().catch(console.error);
