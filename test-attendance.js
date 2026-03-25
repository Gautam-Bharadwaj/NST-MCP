import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    const transport = new StdioClientTransport({ command: 'npx', args: ['-y', '@newtonschool/newton-mcp'], env: process.env });
    const client = new Client({ name: "cli", version: "1" }, { capabilities: {} });
    await client.connect(transport);
    
    console.log("Fetching recent lectures...");
    const res = await client.callTool({ name: 'get_recent_lectures', arguments: { limit: 5 } });
    console.log("Recent:\n", JSON.stringify(res.content[0]?.text, null, 2));
    
    console.log("Fetching courses...");
    const crs = await client.callTool({ name: 'list_courses', arguments: {} });
    const cdata = JSON.parse(crs.content[0]?.text);
    if (cdata.enrollments && cdata.enrollments.length > 0) {
        const c = cdata.enrollments[0];
        if (c.subjects && c.subjects.length > 0) {
            console.log("Fetching progress for subject...");
            const p = await client.callTool({ name: 'get_subject_progress', arguments: { course_hash: c.course_hash, subject_hash: c.subjects[0].subject_hash } });
            console.log("Progress:\n", JSON.stringify(p.content[0]?.text, null, 2));
        }
    }

    process.exit(0);
}
main().catch(console.error);
