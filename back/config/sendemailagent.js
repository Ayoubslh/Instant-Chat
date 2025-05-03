const { google } = require('googleapis');
const { getUserById } = require('../controllers/userControllers');
require('dotenv').config(); // Load environment variables

/**
 * Sends a custom email using Gmail API directly (without LangChain)
 * Simple, direct implementation using Google's official API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function sendCustomEmailFromExternalSource(input,req,res) {
  try {
    if (!input || typeof input !== 'string') {
    const parsed = parseEmailInput(input);
    }
    console.log('Parsed input:', input);
    
const id = parsed.id;
const externalData = {
  to: parsed.to || input.to,
  subject: parsed.subject|| input.subject,
  body: parsed.body|| input.body
} || req.body.externalData || req.body;
    
    if (!id) {
      console.error('User ID not found in request');
      return res.json({
        success: false,
        message: 'User ID not provided'
      });
    }
    
    console.log(`Processing email request for user ID: ${id}`);
    console.log('Email data:', JSON.stringify(externalData));
    
    // Retrieve user data
    const user = await getUserById(id);
    
    if (!user) {
      console.error(`User not found with ID: ${id}`);
      return res.json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.email || !user.accessToken) {
      console.error('User missing email or access token');
      return res.json({
        success: false,
        message: 'User credentials incomplete'
      });
    }
    
    // Check if email data has required fields
    const to = externalData?.to;
    const subject = externalData?.subject;
    const body = externalData?.body || '';
    
    if (!to || !subject) {
      console.error('Missing required email fields');
      return res.json({
        success: false,
        message: 'Missing required email fields (to, subject)'
      });
    }
    
    console.log(`Preparing to send email to: ${to}`);
    
    // Set up OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    // Set credentials
    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken // If you have it stored
    });
    
    // Create Gmail instance
    const gmail = google.gmail({
      version: 'v1',
      auth: oauth2Client
    });
    
    // Create email content
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: ${user.email}`,
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      body
    ];
    const message = messageParts.join('\n');
    
    // Encode the message as base64 URL safe
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    console.log('Sending email via Gmail API...');
    
    // Send the email
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });
    
    console.log('Email sent successfully!', result.data);
    
    // return res.json({
    //   success: true,
    //   message: 'Email sent successfully',
    //   details: {
    //     to: to,
    //     subject: subject,
    //     messageId: result.data.id
    //   }
    // });
    
  } catch (error) {
    console.error("Error sending email:", error);
    
    // Handle common error cases
    if (error.code === 401 || error.message?.includes('auth')) {
      return res.json({
        success: false,
        message: 'Authentication error. Your access token may have expired.'
      });
    }
    
    if (error.code === 429 || error.message?.includes('quota')) {
      return res.json({
        success: false,
        message: 'Rate limit exceeded. Please try again later.'
      });
    }
    
    return res.json({
      success: false,
      message: `Failed to send email: ${error.message || 'Unknown error'}`
    });
  }
}
function parseEmailInput(input) {
  const id = input.match(/\b[a-f0-9]{24}\b/)?.[0]; // Extract user ID

  
  const toMatch = input.match(/to:'([^']+)'/i);

  // Match the 'subject' field
  const subjectMatch = input.match(/subject:\s*([^\n]+)\s*body:/i
);

  // Match the 'body' content
  const bodyMatch = input.match(/body:\s*([^,]+(?:,\s*id)?)/i);



  return {
    id,
    to: toMatch?.[1]?.trim(),
    subject: subjectMatch?.[1]?.trim(),
    body: bodyMatch?.[1]?.trim()
  };
}

// Export the function for use in your controllers
module.exports = { sendCustomEmailFromExternalSource };