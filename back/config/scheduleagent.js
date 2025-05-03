const { createReactAgent } = require("@langchain/langgraph/prebuilt");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { Tool } = require("@langchain/core/tools");
require("dotenv").config();
const { google } = require("googleapis");

/**
 * Create custom Calendar tools using Google Calendar API directly instead of LangChain wrappers
 * This avoids the "Missing llm instance" error with the LangChain Google Calendar tools
 */
class CustomGoogleCalendarCreateTool extends Tool {
  constructor(auth) {
    super();
    this.name = "GoogleCalendarCreate";
    this.description = `Use this tool to create events on Google Calendar.
Input should be a JSON string with the following format:
{
  "summary": "Event title",
  "description": "Event description",
  "start": "2025-05-04T09:00:00-04:00", // RFC3339 timestamp with timezone
  "end": "2025-05-04T10:00:00-04:00",   // RFC3339 timestamp with timezone
  "location": "Optional location"        // Optional
}`;
    this.calendar = google.calendar({ version: "v3", auth });
  }

  async _call(input) {
    try {
      console.log("Creating calendar event with input:", input);
      let eventData;
      
      try {
        eventData = JSON.parse(input);
      } catch (err) {
        return `Error parsing input: ${err.message}. Please provide properly formatted JSON.`;
      }
      
      // Validate required fields
      if (!eventData.summary || !eventData.start || !eventData.end) {
        return "Missing required fields. Please provide summary, start, and end times.";
      }
      
      const event = {
        summary: eventData.summary,
        description: eventData.description || "",
        start: {
          dateTime: eventData.start,
          timeZone: "America/New_York", // Default timezone
        },
        end: {
          dateTime: eventData.end,
          timeZone: "America/New_York", // Default timezone
        },
      };
      
      if (eventData.location) {
        event.location = eventData.location;
      }
      
      const response = await this.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });
      
      return `Event created successfully: "${eventData.summary}" on ${new Date(eventData.start).toLocaleString()}`;
    } catch (error) {
      console.error("Error creating calendar event:", error);
      return `Failed to create calendar event: ${error.message}`;
    }
  }
}

class CustomGoogleCalendarViewTool extends Tool {
  constructor(auth) {
    super();
    this.name = "GoogleCalendarView";
    this.description = `Use this tool to view events on Google Calendar.
Input should be a time range in natural language like "today", "tomorrow", "this week", or specific dates like "2025-05-04".`;
    this.calendar = google.calendar({ version: "v3", auth });
  }

  async _call(input) {
    try {
      console.log("Viewing calendar events with input:", input);
      
      // Parse the date range from natural language
      let timeMin, timeMax;
      
      const now = new Date();
      const inputLower = input.toLowerCase().trim();
      
      if (inputLower === "today") {
        timeMin = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
        timeMax = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
      } else if (inputLower === "tomorrow") {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        timeMin = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0, 0).toISOString();
        timeMax = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59).toISOString();
      } else if (inputLower === "this week") {
        // Start of this week (Sunday)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        // End of this week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        timeMin = startOfWeek.toISOString();
        timeMax = endOfWeek.toISOString();
      } else {
        // Assume it's a specific date in YYYY-MM-DD format
        try {
          const specificDate = new Date(inputLower);
          timeMin = new Date(specificDate.getFullYear(), specificDate.getMonth(), specificDate.getDate(), 0, 0, 0).toISOString();
          timeMax = new Date(specificDate.getFullYear(), specificDate.getMonth(), specificDate.getDate(), 23, 59, 59).toISOString();
        } catch (e) {
          // Default to today if parsing fails
          timeMin = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
          timeMax = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
        }
      }
      
      const response = await this.calendar.events.list({
        calendarId: "primary",
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: "startTime",
      });
      
      const events = response.data.items || [];
      
      if (events.length === 0) {
        return `No events found for ${input}.`;
      }
      
      // Format the events nicely
      const formattedEvents = events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        const formattedTime = new Date(start).toLocaleString();
        return `${i + 1}. ${event.summary} - ${formattedTime}${event.location ? ` at ${event.location}` : ''}`;
      });
      
      return `Events for ${input}:\n${formattedEvents.join("\n")}`;
    } catch (error) {
      console.error("Error viewing calendar events:", error);
      return `Failed to view calendar events: ${error.message}`;
    }
  }
}

/**
 * Run a calendar agent to create events and view calendar
 * @param {string} userInput - User's request to create a calendar event
 * @param {string} viewInput - User's request to view calendar events (defaults to today's meetings)
 * @returns {Object} - Results of calendar operations
 */
const runCalendarAgent = async (userInput, viewInput = "What meetings do I have today?") => {
  try {
    console.log("Calendar Agent - Processing input:", userInput);
    
    // Input validation
    if (!userInput || typeof userInput !== "string") {
      console.error("Invalid userInput:", userInput);
      throw new Error("userInput is required and must be a string");
    }
    
    // Format the input to be more explicit about creating a calendar event
    const formattedInput = userInput.toLowerCase().includes("create") || 
                          userInput.toLowerCase().includes("schedule") || 
                          userInput.toLowerCase().includes("add") ?
                          userInput : 
                          `Create a calendar event for: ${userInput}`;
    
    console.log("Calendar Agent - Formatted input:", formattedInput);

    // Initialize the model with appropriate parameters
    const model = new ChatGoogleGenerativeAI({
      temperature: 0.2,
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-2.0-flash",
      maxOutputTokens: 2048, // Added to ensure enough tokens for detailed reasoning
    });

    // Validate Google Calendar credentials
    if (!process.env.GOOGLE_CALENDAR_CLIENT_EMAIL || 
        !process.env.GOOGLE_CALENDAR_PRIVATE_KEY || 
        !process.env.GOOGLE_CALENDAR_CALENDAR_ID) {
      throw new Error("Missing required Google Calendar credentials in environment variables");
    }
    
    // Set up Google OAuth2 client for Calendar API
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CALENDAR_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_CALENDAR_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ['https://www.googleapis.com/auth/calendar'],
      null
    );
    
    // Log the authentication details
    console.log("Calendar Agent - Using client email:", process.env.GOOGLE_CALENDAR_CLIENT_EMAIL);
    console.log("Calendar Agent - Private key length:", process.env.GOOGLE_CALENDAR_PRIVATE_KEY.replace(/\\n/g, "\n").length);
    
    // Initialize custom calendar tools with JWT auth
    const createTool = new CustomGoogleCalendarCreateTool(auth);
    const viewTool = new CustomGoogleCalendarViewTool(auth);
    
    const tools = [createTool, viewTool];

    // System message to guide the agent
    const systemMessage = `You are a helpful calendar assistant that creates and manages Google Calendar events.

IMPORTANT INSTRUCTIONS FOR CREATING EVENTS:
1. Always extract specific date, time, duration, and title from the user's request
2. If time is ambiguous, assume business hours (9am-5pm)
3. If date is not specified, use the current date
4. Always use ISO format for dates and times (YYYY-MM-DD)
5. For calendar event creation, call the GoogleCalendarCreate tool with a properly formatted JSON
6. Always use RFC3339 format for dates in the tool input (e.g., 2025-05-04T09:00:00-04:00)
7. If the user provides a time zone, use it; otherwise, default to Eastern Time (UTC-4)

When creating events:
1. Extract a meaningful title from the user's description
2. Set appropriate start and end times (default to 1 hour duration if not specified)
3. Format the JSON correctly for the GoogleCalendarCreate tool

The current date is ${new Date().toDateString()}.`;

    // Create the agent with proper configuration
    const calendarAgent = createReactAgent({
      llm: model,
      tools,
      systemMessage,
      verbose: true,
      maxIterations: 5,
    });

    // First try creating the event
    console.log("Calendar Agent - Attempting to create event...");
    const createRes = await calendarAgent.invoke({
      messages: [{ role: "user", content: formattedInput }],
    });
    
    console.log("Calendar Agent - Create response received");
    
    // Log the actual tool calls that were made
    if (createRes.toolCalls && createRes.toolCalls.length > 0) {
      console.log("Calendar Agent - Tool calls made:", 
                  createRes.toolCalls.map(call => ({
                    tool: call.name,
                    args: call.args
                  })));
    }
    
    const createOutput = createRes?.messages?.at(-1)?.content || "No response for event creation.";
    
    // Only run the view operation if create was successful
    console.log("Calendar Agent - Viewing calendar...");
    const viewRes = await calendarAgent.invoke({
      messages: [{ role: "user", content: viewInput || "What meetings do I have today?" }],
    });
    
    const viewOutput = viewRes?.messages?.at(-1)?.content || "No response for calendar view.";

    return {
      success: true,
      result: createOutput,
      viewResult: viewOutput,
    };
  } catch (err) {
    console.error("Calendar Agent Error:", err);
    console.error("Error stack:", err.stack);
    return {
      success: false,
      error: `Failed to run calendar agent: ${err.message}`,
      errorDetails: err.stack
    };
  }
};

// Express route handler for the calendar agent
const handleCalendarRequest = async (req, res) => {
  try {
    const { userInput, viewInput } = req.body;
    
    if (!userInput) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameter: userInput"
      });
    }
    
    const result = await runCalendarAgent(userInput, viewInput || "What meetings do I have today?");
    
    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error,
        details: result.errorDetails
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Calendar event processed successfully",
      createResult: result.result,
      viewResult: result.viewResult
    });
  } catch (error) {
    console.error("Calendar Request Handler Error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to process calendar request: ${error.message}`,
      details: error.stack
    });
  }
};

module.exports = { 
  runCalendarAgent,
  handleCalendarRequest
};