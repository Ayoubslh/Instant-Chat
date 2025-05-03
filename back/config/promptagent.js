const { ChatGroq } = require("@langchain/groq");
const { DynamicTool } = require("@langchain/core/tools");
const { SystemMessage, HumanMessage } = require("@langchain/core/messages");
const { writeEmail } = require("./emaildraftingagent");
const { runCalendarAgent } = require("./scheduleagent");
const { sendCustomEmailFromExternalSource } = require("./sendemailagent");

const dotenv = require("dotenv");
dotenv.config();

// Define tools
const tools = [
  new DynamicTool({
    name: "writeEmail",
    description: "Draft or reply to emails based on context.",
    func: async (input) => {
      const result = await writeEmail(input);
      return result || "No email drafted";
    },
  }),
  new DynamicTool({
    name: "runCalendarAgent",
    description: "Create or manage calendar events from text.",
    func: async (input) => {
      const result = await runCalendarAgent(input);
      return result || "No calendar event created";
    },
  }),
  new DynamicTool({
    name: "sendEmail",
    description: "Send a custom email with subject and body.",
    func: async (input) => {
      const result = await sendCustomEmailFromExternalSource(input);
      return result || "No email sent";
    },
  }),
  // Simplified version that directly uses the email parts from drafting
  new DynamicTool({
    name: "draftAndSendEmail",
    description: "Draft an email and send it immediately",
    func: async (input) => {
      try {
        // First, modify the writeEmail function to return structured data
        // This assumes we've updated emaildraftingagent.js to include this function
        const draftedEmail = await writeEmailAndGetStructured(input);
        
        if (!draftedEmail || !draftedEmail.to || !draftedEmail.subject || !draftedEmail.body) {
          throw new Error("Email drafting did not return proper email parts");
        }
        
        // Now directly send using the structured data
        const sendResult = await sendCustomEmailFromExternalSource(JSON.stringify(draftedEmail));
        
        return `📧 Email drafted and sent successfully:
To: ${draftedEmail.to}
Subject: ${draftedEmail.subject}
------------------
${draftedEmail.body}
------------------
Send status: ${sendResult}`;
      } catch (error) {
        console.error("Error in draftAndSendEmail:", error);
        return `Failed to draft and send email: ${error.message}`;
      }
    },
  }),
];

// Helper function to get structured email data
async function writeEmailAndGetStructured(input) {
  // First get the regular email draft
  const emailDraft = await writeEmail(input);
  
  // Parse the email parts
  const toMatch = emailDraft.match(/To: (.*?)(?:\n|$)/);
  const subjectMatch = emailDraft.match(/Subject: (.*?)(?:\n|$)/);
  const bodyMatch = emailDraft.match(/------------------\n([\s\S]*?)\n------------------/);
  
  // Create structured object
  return {
    to: toMatch ? toMatch[1].trim() : "",
    subject: subjectMatch ? subjectMatch[1].trim() : "",
    body: bodyMatch ? bodyMatch[1].trim() : "",
    originalDraft: emailDraft // Keep the original for reference
  };
}

// Helper function for JSON extraction and parsing (unchanged)
function extractJSON(text) {
  // First, attempt to find a JSON-like structure
  const jsonRegex = /\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\}/g;
  const matches = text.match(jsonRegex);
  
  if (matches && matches.length > 0) {
    // Try each matched block
    for (const match of matches) {
      try {
        return JSON.parse(match);
      } catch (e) {
        // Try to fix common JSON issues and retry
        try {
          // Fix unescaped quotes within strings
          const fixedJson = match.replace(/"([^"]*)":\s*"(.*)"/g, (_, key, value) => {
            const escapedValue = value.replace(/(?<!\\)"/g, '\\"');
            return `"${key}": "${escapedValue}"`;
          });
          return JSON.parse(fixedJson);
        } catch (e2) {
          // Continue to next match if this one fails
          continue;
        }
      }
    }
  }
  
  // If no valid JSON found, try to create a simple structure based on tool detection
  if (text.includes("writeEmail")) {
    const inputText = text.substring(text.indexOf("writeEmail") + 10).trim();
    return { tool: "writeEmail", input: inputText };
  } else if (text.includes("runCalendarAgent")) {
    const inputText = text.substring(text.indexOf("runCalendarAgent") + 16).trim();
    return { tool: "runCalendarAgent", input: inputText };
  } else if (text.includes("sendEmail")) {
    const inputText = text.substring(text.indexOf("sendEmail") + 9).trim();
    return { tool: "sendEmail", input: inputText };
  } else if (text.includes("draftAndSendEmail")) {
    const inputText = text.substring(text.indexOf("draftAndSendEmail") + 17).trim();
    return { tool: "draftAndSendEmail", input: inputText };
  }
  
  // Default fallback
  return null;
}

// Initialize LLM (unchanged)
const llm = new ChatGroq({
  model: "llama3-8b-8192",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.3,
});

// Handle user input (main function)
const handleInput = async (userInput) => {
  console.log("Handling input:", userInput);
  try {
    // Create messages with HTML formatting to encourage structured output
    const systemPrompt = `
    You are an AI assistant that helps users by selecting appropriate tools.
    
    <instructions>
    Based on the user's input, select ONE of these tools:
    - writeEmail: For drafting or replying to emails (when user just wants a draft)
    - runCalendarAgent: For scheduling or managing calendar events
    - sendEmail: For sending emails with custom subject/body (when user already has email content)
    - draftAndSendEmail: For drafting AND immediately sending an email (when user wants both actions)
    </instructions>
    
    <output_format>
    Respond ONLY with a valid JSON object containing two fields:
    - "tool": The selected tool name (one of the options above)
    - "input": The text input to pass to the tool
    
    Example: {"tool":"writeEmail","input":"Draft an email to John thanking him for the meeting"}
    Example: {"tool":"draftAndSendEmail","input":"Send an email to Sarah to reschedule our meeting for next Tuesday"}
    </output_format>
    `;
    
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userInput),
    ];

    // Call the LLM directly with messages
    const response = await llm.invoke(messages);
    console.log("Raw LLM response:", response.content);
    
    // Use our robust extraction method
    const toolCall = extractJSON(response.content);
    
    if (!toolCall) {
      throw new Error("Could not extract a valid tool call from the LLM response");
    }
    
    console.log("Extracted tool call:", toolCall);

    // Validate tool call
    if (!toolCall.tool || !toolCall.input) {
      throw new Error("Invalid tool call format. Expected {tool, input}");
    }

    // Invoke the selected tool
    const tool = tools.find(t => t.name === toolCall.tool);
    if (!tool) {
      throw new Error(`Tool ${toolCall.tool} not found`);
    }

    // Pass just the input value to the tool function
    const result = await tool.func(toolCall.input);
    console.log("Tool result:", result);

    return result || "Agent completed but no output was generated.";
  } catch (error) {
    console.error("Error executing agent:", error);
    return { error: `There was an issue processing your request: ${error.message}` };
  }
};

module.exports = { handleInput, writeEmailAndGetStructured };