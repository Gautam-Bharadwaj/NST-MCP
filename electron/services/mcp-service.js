import { getCachedData, setCachedData } from './cache-service.js';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

let mcpClient = null;
let mcpTransport = null;
let isConnected = false;

// 1. Core MCP Client Connect implementation
export const connectToNewtonMCP = async () => {
    if (isConnected) return;
    try {
        console.log("Spawning Newton MCP Background Server...");
        mcpTransport = new StdioClientTransport({
            command: 'npx',
            args: ['-y', '@newtonschool/newton-mcp'],
            stderr: 'inherit',
            env: process.env
        });
        
        mcpClient = new Client(
            { name: "newton-ai-dashboard", version: "1.0.0" },
            { capabilities: { tools: {} } }
        );
        
        await mcpClient.connect(mcpTransport);
        isConnected = true;
        console.log("Successfully bridged to @newtonschool/newton-mcp!");
        
        // Log available tools from their backend to understand Newton's endpoints
        const tools = await mcpClient.listTools();
        console.log(">> Discovered Next-Gen Newton Tools:", tools.tools.map(t => t.name));
        
    } catch (error) {
        console.error("MCP Engine Failed to ignite:", error.message);
    }
};

// 2. Universal Tool Execution with Graceful Fallback
async function callMcpTool(toolName, args, fallbackData) {
    if (!isConnected) {
        await connectToNewtonMCP();
    }
    
    if (isConnected && mcpClient) {
        try {
            console.log(`Executing Newton Tool: ${toolName}...`);
            const response = await mcpClient.callTool({
                name: toolName,
                arguments: args
            });
            const textContent = response.content.find(c => c.type === 'text')?.text;
            if (textContent) {
                try { return JSON.parse(textContent); } catch { return textContent; }
            }
            return response;
        } catch (error) {
            console.error(`Newton Tool [${toolName}] Error => Using local fallback.`);
        }
    }
    return fallbackData; // Fallback to mock arrays if Newton portal is unreachable
}

const withCache = async (key, fetcher, ttlMs = 300000) => {
  const cached = getCachedData(key, ttlMs);
  if (cached) return cached;
  const data = await fetcher();
  setCachedData(key, data);
  return data;
};

// Newton MCP Valid Endpoints
export const getUpcomingSchedule = async () => {
    const result = await callMcpTool('get_upcoming_schedule', {}, null);
    if (!result) return [];
    
    const combined = [];
    const lectures = result.upcoming_lectures || [];
    const contests = result.upcoming_contests || [];
    
    lectures.forEach((item, idx) => combined.push({ id: `l-${idx}`, title: item.title || item.name || 'Lecture', date: item.start_time, type: 'class' }));
    contests.forEach((item, idx) => combined.push({ id: `c-${idx}`, title: item.title || item.name || 'Contest', date: item.start_time, type: 'contest' }));
    
    return combined;
};

export const getRecentLectures = async () => {
    // Fetch 50 lectures to get a robust attendance calculation sample
    const result = await callMcpTool('get_recent_lectures', { limit: 50 }, null);
    if (!result) return [];
    return result;
};

export const listCourses = async () => {
    const result = await callMcpTool('list_courses', {}, null);
    if (!result) return null;
    return result;
};

export const getSubjectProgress = async () => {
    try {
        // Step 1: Discover a valid subject_hash
        const courses = await listCourses();
        if (!courses || !courses.enrollments || courses.enrollments.length === 0) return [];
        
        let primaryCourse = courses.primary_course_hash ? courses.enrollments.find(c => c.course_hash === courses.primary_course_hash) : courses.enrollments[0];
        if (!primaryCourse || !primaryCourse.subjects || primaryCourse.subjects.length === 0) return [];
        
        // Step 2: Fetch progress for the first major subject as sample
        const subject = primaryCourse.subjects[0];
        const progressRes = await callMcpTool('get_subject_progress', { course_hash: primaryCourse.course_hash, subject_hash: subject.subject_hash }, null);
        
        if (!progressRes) return [];
        
        // Wrap it in UI friendly array format
        return [{
            subject: subject.name || progressRes.subject_name || 'Subject',
            progress: progressRes.completion_percentage || progressRes.progress || 0,
            topics: progressRes.topics ? progressRes.topics.slice(0, 3).map(t => `${t.name}: ${t.progress}%`) : []
        }];
    } catch (e) {
        return [];
    }
};

export const getAssignments = async () => {
    const result = await callMcpTool('get_assignments', { include_contests: true }, null);
    if (!result || !result.assignments) return [];
    
    const now = Date.now();
    return result.assignments.map(a => ({
        ...a,
        status: now > a.end_timestamp ? 'overdue' : 'pending'
    }));
};

export const searchPracticeQuestions = async (topic = 'arrays') => {
    const result = await callMcpTool('search_practice_questions', { limit: 10, topics: topic }, null);
    if (result && result.questions && result.questions.length > 0) {
        return result.questions.map((q, i) => ({
            id: i,
            title: q.title,
            difficulty: q.difficulty,
            topic: q.topics && q.topics.length > 0 ? q.topics[0] : 'General',
            url: q.url || '#'
        }));
    }
    return [];
};
