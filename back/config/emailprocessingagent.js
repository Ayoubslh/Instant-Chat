const { DynamicTool } = require('langchain/tools');
const { ZeroShotAgent, AgentExecutor } = require('langchain/agents');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatGroq } = require('@langchain/groq');
const { LLMChain } = require('langchain/chains');
const { StructuredOutputParser } = require('langchain/output_parsers');
require('dotenv').config(); // Load environment variables



// Validate environment variables
if (!process.env.GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY environment variable');
}

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('Missing GOOGLE_API_KEY environment variable');
}

// Initialize Groq client
const summary = new ChatGroq({
  model: "	mixtral-8x7b-32768",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.7,
});
const categorization = new ChatGroq({
  model: "	gemma-7b-it",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.7,
});
const prioritization = new ChatGroq({
  model: "llama3-8b-8192",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.7,
});
const actionitems = new ChatGroq({
  model: "mixtral-8x7b-32768",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.7,
});

// Summary Tool
const summaryTool = new DynamicTool({
  name: "summarize_email",
  description: "Summarize the email content to extract key information.",
  func: async (input) => {
    try {
      const response = await summary.invoke(
        `Summarize the following email content in a way that covers the most important information:

${input}`
      );
      return response.content || response.text;
    } catch (error) {
      console.error("Error summarizing email:", error);
      return "Failed to summarize email: " + error.message;
    }
  },
});

// Classify Tool
const classifyTool = new DynamicTool({
  name: "classify_email",
  description: "Classify the email content into a relevant category like Work, Personal, Promotion, etc.",
  func: async (input) => {
    try {
      const response = await categorization.invoke(
        `Classify the following email content into one specific category.
Output ONLY the category name (like Work, Personal, Promotion) followed by a hyphen and a brief explanation.
Format: "Category: [category] - [brief explanation]"

${input}`
      );
      return response.content || response.text;
    } catch (error) {
      console.error("Error classifying email:", error);
      return "Failed to classify email: " + error.message;
    }
  },
});

// Priority Tool
const priorityTool = new DynamicTool({
  name: "prioritize_email",
  description: "Prioritize the email on a scale of 1-5 based on urgency and importance.",
  func: async (input) => {
    try {
      const response = await prioritization.invoke(
        `Rate the priority of the following email on a scale of 1-5 (where 1 is lowest and 5 is highest).
Output ONLY the priority number followed by a hyphen and a brief justification.
Format: "Priority: [1-5] - [brief justification]"

${input}`
      );
      return response.content || response.text;
    } catch (error) {
      console.error("Error prioritizing email:", error);
      return "Failed to prioritize email: " + error.message;
    }
  },
});

// Action Items Tool
const actionItemsTool = new DynamicTool({
  name: "extract_action_items",
  description: "Extract action items and tasks that need to be completed from the email.",
  func: async (input) => {
    try {
      const response = await actionitems.invoke(
        `Extract any action items, tasks, or to-dos from the following email.
Format: "Action Items: [bullet point list]"
If there are no action items, output "Action Items: None found."

${input}`
      );
      return response.content || response.text;
    } catch (error) {
      console.error("Error extracting action items:", error);
      return "Failed to extract action items: " + error.message;
    }
  },
});

// Create the email agent
async function createEmailAgent() {
  const tools = [summaryTool, classifyTool, priorityTool, actionItemsTool];

  // Initialize Google AI client
  const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.0-flash",
    temperature: 0.3,
  });

  // Define the prompt template with structured output format
  const prefix = `You are an email processing assistant. Your job is to analyze emails and provide structured information about them.

You must extract and reuse the original email's:
- TO (recipient)
- SUBJECT
- Body

You have access to the following tools:
-summarize_email
-extract_action_items
-prioritize_email
-classify_email:Classify the email content into a relevant category like Work, Personal, Promotion, etc.,it must be consistent.from the subject and body


-summarize_email: Summarize the email content to extract key information.
-classify_email: Classify the email content into a relevant category like Work, Personal, Promotion, etc.
-prioritize_email: Prioritize the email on a scale of 1-5 based on urgency and importance.
-extract_action_items: Extract action items and tasks that need to be completed from the email.

After using the tools, provide your final answer in the following format **exactly**:

TO: [recipient of the original email]  
SUBJECT: [original email subject]  
Body: [original email body]  
Summary: [1-3 sentence summary of the email]  
Category: [category] - [brief explanation]  
Priority: [low,medium,high] - [justification]  
Action Items:  
- [action item 1]  
- [action item 2]  
- etc.

This format is mandatory. Begin!`;

  const suffix = `Begin!

Email: {input}
{agent_scratchpad}`;

  // Create the agent with proper tool definition
  const prompt = ZeroShotAgent.createPrompt(tools, { prefix, suffix });
  const llmChain = new LLMChain({ llm, prompt });

  const agent = new ZeroShotAgent({
    llmChain,
    allowedTools: tools.map(tool => tool.name),
  });

  // Create the agent executor
  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: process.env.DEBUG === 'true',
    maxIterations: 3,
  });

  return executor;
}

// Process email function with structured output
async function processEmail(emailContent) {
  try {
    const agent = await createEmailAgent();
    const result = await agent.call({
      input: emailContent,
    });

    // Return the structured email insights directly
    return extractEmailInsights(result.output || result);
  } catch (error) {
    console.error("Error processing email:", error);
    throw new Error(`Email processing failed: ${error.message}`);
  }
}

// Function to extract structured information from agent response
function extractEmailInsights(agentOutput) {
  const insights = {
    to: null,
    subject: null,
    body: null,
    summary: null,
    category: null,
    priority: null,
    actionItems: [],
  };

  const outputText = agentOutput || '';

  // Extract category
  const categoryMatch = outputText.match(/Category:?\s*([A-Za-z]+(?:\s*\/\s*[A-Za-z]+)*)\s*(?:[-–]\s*)?([^\n]+)?/i);
  if (categoryMatch) {
    insights.category = {
      type: categoryMatch[1].trim(),
      description: categoryMatch[2] ? categoryMatch[2].trim() : '',
    };
  }

  const priorityMatch = outputText.match(/Priority:?\s*(low|medium|high)\s*(?:[-–]\s*)?([^\n]+)?/i);
  if (priorityMatch) {
    insights.priority = {
      level: priorityMatch[1].toLowerCase(),
      justification: priorityMatch[2] ? priorityMatch[2].trim() : '',
    };
  }

  // Extract action items
  const actionItemsSection = outputText.match(/Action Items:?\s*([\s\S]+?)(?:\n\n|\n*$)/i);
  if (actionItemsSection) {
    const actionItemsList = actionItemsSection[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim()));

    if (actionItemsList.length > 0) {
      insights.actionItems = actionItemsList.map(item => item.replace(/^[•\-\d\.]+\s*/, '').trim());
    }
  }
 // Extract TO (recipient)
 const toSection = outputText.match(/TO:?\s*([\s\S]+?)(?:\n\n|\n*$)/i);
 if (toSection) {
   insights.to = toSection[1].trim();

    // Extract subject
  const subjectSection = outputText.match(/Subject:?\s*([\s\S]+?)(?:\n\n|\n*$)/i);
  if (subjectSection) {
    insights.subject = subjectSection[1].trim();
  }
 }

 // Extract body
 const bodySection = outputText.match(/Body:?\s*([\s\S]+?)(?:\n\n|\n*$)/i);
 if (bodySection) {
   insights.body = bodySection[1].trim();
 }
  // Extract summary
  const summarySection = outputText.match(/Summary:?\s*([\s\S]+?)(?:\n\n|\n*Category:|\n*$)/i);
  if (summarySection) {
    insights.summary = summarySection[1].trim();
  }

  

 

 

  return insights;
}

// Export the functions
module.exports = { createEmailAgent, processEmail, extractEmailInsights };
