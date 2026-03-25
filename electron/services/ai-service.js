import * as mcpService from './mcp-service.js';
import Store from 'electron-store';
import Anthropic from '@anthropic-ai/sdk';

const store = new Store();

export const handleAiRequest = async (event, query, history = []) => {
  const qStr = query.toLowerCase();
  const apiKey = store.get('anthropic_api_key');
  
  // 1. Intent & Slash Command Detection
  let intent = 'general';
  
  // Immediate routing for slash commands
  if (qStr.startsWith('/schedule')) intent = 'schedule';
  else if (qStr.startsWith('/recent')) intent = 'recent';
  else if (qStr.startsWith('/dsa')) intent = 'dsa';
  else if (qStr.startsWith('/progress')) intent = 'progress';
  else {
    // Natural language heuristic
    if (qStr.includes('schedule') || qStr.includes('class') || qStr.includes('contest')) intent = 'schedule';
    else if (qStr.includes('recent') || qStr.includes('last class')) intent = 'recent';
    else if (qStr.includes('progress') || qStr.includes('doing') || qStr.includes('completion')) intent = 'progress';
    else if (qStr.includes('practice') || qStr.includes('dsa') || qStr.includes('question') || qStr.includes('problem')) intent = 'dsa';
  }

  // 2. Fetch MCP Data based on intent
  let dataPayload = null;
  switch (intent) {
    case 'schedule': dataPayload = await mcpService.getUpcomingSchedule(); break;
    case 'recent': dataPayload = await mcpService.getRecentLectures(); break;
    case 'progress': dataPayload = await mcpService.getSubjectProgress(); break;
    case 'dsa': {
      let topic = 'all';
      if (qStr.includes('array')) topic = 'Arrays';
      else if (qStr.includes('tree')) topic = 'Trees';
      else if (qStr.includes('dp') || qStr.includes('dynamic')) topic = 'DP';
      dataPayload = await mcpService.searchPracticeQuestions(topic);
      break;
    }
  }

  // 3. Generate Response
  let responseText = '';
  
  if (apiKey && apiKey.startsWith('sk-ant-')) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const systemPrompt = `You are Newton AI, a dedicated student assistant for Newton School students.
      You have access to the user's data. Help them manage their schedule, assignments, and learning. 
      Use Markdown formatting (like bold, lists, and code blocks) where appropriate to make responses extremely readable.
      Current context data: ${JSON.stringify(dataPayload)}`;

      // Use the Streaming API
      const stream = await anthropic.messages.stream({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          ...history.map(h => ({ role: h.role, content: h.content })),
          { role: "user", content: query }
        ],
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          responseText += chunk.delta.text;
          // Send chunk to frontend
          if (event && event.sender) {
            event.sender.send('ai:reply-chunk', chunk.delta.text);
          }
        }
      }
      
    } catch (err) {
      console.error("Claude API Error:", err);
      responseText = "I encountered an error connecting to Claude. Using local brain: " + getSimulatedResponse(intent, dataPayload);
    }
  } else {
    responseText = getSimulatedResponse(intent, dataPayload);
    // Simulate streaming for local brain fallback
    if (event && event.sender) {
        const words = responseText.split(' ');
        for (let i = 0; i < words.length; i++) {
            event.sender.send('ai:reply-chunk', words[i] + ' ');
            await new Promise(r => setTimeout(r, 50));
        }
    }
  }

  return {
    role: 'assistant',
    content: responseText,
    intent,
    dataPayload
  };
};

function getSimulatedResponse(intent, data) {
  switch (intent) {
    case 'schedule': return "Here is your upcoming schedule. You have **classes and contests** coming up soon. Stay sharp!";
    case 'recent': return "These are the most recent lectures from your courses.";
    case 'progress': return "Your current progress metrics across enrolled courses.";
    case 'dsa': return "I've pulled some DSA practice problems for you. High-performance repetition is key to mastery.\n\n```python\n# Example constraint checker\nif len(arr) == 0:\n    return None\n```";
    default: return "I'm NST-X! Ask me about your academic metrics, DSA practice, or recent lectures.\n\nTry typing `/schedule` or `/recent` for instant data streams.";
  }
}
