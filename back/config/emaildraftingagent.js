const { DynamicTool } = require('langchain/tools');
const { ZeroShotAgent, AgentExecutor } = require('langchain/agents');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatGroq } = require('@langchain/groq');
const { LLMChain } = require('langchain/chains');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.GROQ_API_KEY) throw new Error('Missing GROQ_API_KEY');
if (!process.env.GOOGLE_API_KEY) throw new Error('Missing GOOGLE_API_KEY');


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function invokeWithRetry(primaryModel, fallbackModel, input, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await primaryModel.invoke(input);
      return response.content || response.text;
    } catch (err) {
      const isOverload = err.status === 503 || err.message.includes('overloaded');
      if (isOverload && fallbackModel) {
        console.warn(`Gemini overloaded. Using fallback model.`);
        const fallbackResponse = await fallbackModel.invoke(input);
        return fallbackResponse.content || fallbackResponse.text;
      } else if (isOverload && attempt < retries) {
        console.warn(`Retry ${attempt}: Gemini overloaded. Waiting ${attempt * 1000}ms...`);
        await sleep(attempt * 1000);
      } else {
        throw err;
      }
    }
  }
}

// Primary and fallback models
const suggestionPrimary = new ChatGroq({
  model: "llama-3.1-8b-instant",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.7,
});

const draftPrimary = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.7,
});

const draftFallback = new ChatGroq({
  model: "llama-3.1-8b-instant",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.7,
});

// Dynamic tools
const suggestiontool = new DynamicTool({
  name: "suggest email reply",
  description: "Suggest a reply to the email content.",
  func: async (input) => {
    try {
      const response = await suggestionPrimary.invoke(
        `Suggest a reply to the following email content.\nFormat: "Reply: [suggested reply]"\n\n${input}`
      );
      return response.content || response.text;
    } catch (error) {
      console.error("Error suggesting email:", error);
      return "Failed to suggest email: " + error.message;
    }
  },
});

const draftTool = new DynamicTool({
  name: "draft email",
  description: "Draft a response to the email content.",
  func: async (input) => {
    try {
      const prompt = `Draft a response to the following email content.\nFormat: "Draft: [drafted email]"\n\n${input}`;
      const response = await invokeWithRetry(draftPrimary, draftFallback, prompt);
      return response;
    } catch (error) {
      console.error("Error drafting email:", error);
      return "Failed to draft email: " + error.message;
    }
  },
});

// Agent creator
async function createEmailAgent() {
  const tools = [suggestiontool, draftTool];

  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
  });

  const prefix = `You are an email drafting and suggestion assistant. Your job is to analyze emails and provide the best replies. Always check email priority when making a decision.

You must extract and reuse the original email's:
- TO (recipient)

You have access to the following tools:
- suggest email reply: Suggest a reply to the email content.
- draft email: Draft a response to the email content.

After using the tools, provide your final answer in the following format exactly:

TO: [recipient of the original email]  
SUBJECT: [original email subject]  
Body: [original email body]`;

  const suffix = `Begin!\n\nEmail: {input}\n{agent_scratchpad}`;

  const prompt = ZeroShotAgent.createPrompt(tools, { prefix, suffix });
  const llmChain = new LLMChain({ llm, prompt });

  const agent = new ZeroShotAgent({
    llmChain,
    allowedTools: tools.map(tool => tool.name),
  });

  return new AgentExecutor({
    agent,
    tools,
    verbose: process.env.DEBUG === 'true',
    maxIterations: 3,
  });
}

// Email processor
async function writeEmail(emailContent) {
  try {
    const agent = await createEmailAgent();

    const result = await agent.invoke({ input: emailContent });


    const insights = extractEmailInsights(result);
    insights.rawOutput = result.output;

    return insights;
  } catch (error) {
    console.error("Error processing email:", error);
    throw new Error(`Email processing failed: ${error.message}`);
  }
}

// Output extractor
function extractEmailInsights(agentOutput) {
  const outputText = agentOutput.output || agentOutput;
  const reply = {
    to: null,
    subject: null,
    body: null,
  };

  const toMatch = outputText.match(/TO:?\s*([\s\S]+?)\n/i);
  if (toMatch) reply.to = toMatch[1].trim();

  const subjectMatch = outputText.match(/SUBJECT:?\s*([\s\S]+?)\n/i);
  if (subjectMatch) reply.subject = subjectMatch[1].trim();

  const bodyMatch = outputText.match(/Body:?\s*([\s\S]+)/i);
  if (bodyMatch) reply.body = bodyMatch[1].trim();

  return reply;
}

module.exports = { createEmailAgent, writeEmail, extractEmailInsights };
