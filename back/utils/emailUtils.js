// utils/emailUtils.js
const { google } = require('googleapis');
const base64url = require('base64url');
const Tesseract = require('tesseract.js');
const User = require('../models/userModel');
require('dotenv').config();
exports.fetchUnreadEmails = async (userId) => {
  const user = await User.findById(userId);
  console.log('User:',   process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,);
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  oAuth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken
  });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const response = await gmail.users.messages.list({
    userId: 'me',
    labelIds: ['UNREAD'],
    maxResults: 10
  });

  const emailPromises = response.data.messages?.map(async (message) => {
    const { data: messageDetails } = await gmail.users.messages.get({
      userId: 'me',
      id: message.id
    });

    const headers = messageDetails.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value;
    const from = headers.find(h => h.name === 'From')?.value;
    const date = headers.find(h => h.name === 'Date')?.value;
    let plainText = '';
    let htmlContent = '';
    let imageText = '';

    const extractParts = async (parts) => {
      for (const part of parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          plainText += base64url.decode(part.body.data);
        } else if (part.mimeType === 'text/html' && part.body?.data) {
          htmlContent += base64url.decode(part.body.data);
        } else if (part.mimeType?.startsWith('image/') && part.body?.attachmentId) {
          const attachment = await gmail.users.messages.attachments.get({
            userId: 'me',
            messageId: message.id,
            id: part.body.attachmentId
          });
          const imageBuffer = Buffer.from(attachment.data.data, 'base64');
          const result = await Tesseract.recognize(imageBuffer, 'eng');
          imageText += result.data.text + '\n';
        }

        if (part.parts) await extractParts(part.parts);
      }
    };

    await extractParts(messageDetails.payload.parts || [messageDetails.payload]);

    return {
      date,
      subject,
      from,
      plainText,
      htmlContent,
      imageText
    };
  }) || [];

  return Promise.all(emailPromises);
};
