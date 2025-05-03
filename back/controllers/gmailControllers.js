//controllers/gmailController.js
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const Email = require("../models/emailModel");
require('dotenv').config();

const base64url = require('base64url'); // You can install this using npm
const { google } = require('googleapis');
const Tesseract = require('tesseract.js');
const { JSDOM } = require('jsdom');
const { fetchUnreadEmails } = require('../utils/emailUtils');

exports.getUnreadEmails = async (req, res, next) => {
  try {
    const emails = await fetchUnreadEmails(req.params.id || req.body.id);
    res.status(200).json({ status: "success", emails });
  } catch (err) {
    console.log(err);
    return next(new AppError(err.message, 400));
  }
};

exports.Addemails = async (req, res, next) => {
  try {

    const { email } = req.body;
    if (!email) {
      return next(new AppError('Email is required', 400));
    }
    const user = await User.findById(req.params.id || req.body.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    user.linkedEmails.push(email); // Assuming emails is an array in the User model
    await user.save({ validateModifiedOnly: true });
    res.status(200).json({ status: "success", message: "Email added successfully" });
  } catch (err) {
    console.log(err);
    return next(new AppError(err.message, 400));
  }
}
//controller to get linked emails
exports.getLinkedEmails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    const linkedEmails = user.linkedEmails;
    res.status(200).json({ status: "success", linkedEmails });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
}

// exports.getUnreadEmails = async (req, res, next) => {
//   try {


//     const user = await User.findById(req.params.id||req.body.id); 

//     const oAuth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       process.env.GOOGLE_REDIRECT_URI,
//     );
//     oAuth2Client.setCredentials({
//       access_token: user.accessToken,
//       refresh_token: user.refreshToken
//     });

//     const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

//     const response = await gmail.users.messages.list({
//       userId: 'me',
//       labelIds: ['UNREAD'],
//       maxResults: 10 // reduced for demo purposes
//     });

//     const emailPromises = response.data.messages.map(async (message) => {
//       const { data: messageDetails } = await gmail.users.messages.get({
//         userId: 'me',
//         id: message.id
//       });

//       const headers = messageDetails.payload.headers;
//       const subject = headers.find(h => h.name === 'Subject')?.value;
//       const from = headers.find(h => h.name === 'From')?.value;

//       let plainText = '';
//       let htmlContent = '';
//       let imageText = '';

//       const extractParts = async (parts) => {
//         for (const part of parts) {
//           if (part.mimeType === 'text/plain' && part.body?.data) {
//             plainText += base64url.decode(part.body.data);
//           } else if (part.mimeType === 'text/html' && part.body?.data) {
//             htmlContent += base64url.decode(part.body.data);
//           } else if (part.mimeType.startsWith('image/') && part.body?.attachmentId) {
//             const attachment = await gmail.users.messages.attachments.get({
//               userId: 'me',
//               messageId: message.id,
//               id: part.body.attachmentId
//             });
//             const imageBuffer = Buffer.from(attachment.data.data, 'base64');
//             const result = await Tesseract.recognize(imageBuffer, 'eng');
//             imageText += result.data.text + '\n';
//           }

//           if (part.parts) await extractParts(part.parts); // recursive for nested parts
//         }
//       };

//       await extractParts(messageDetails.payload.parts || [messageDetails.payload]);

//       return {
//         subject,
//         from,
//         plainText,
//         htmlContent,
//         imageText
//       };
//     });

//     const emails = await Promise.all(emailPromises);
//     res.status(200).json({ status: "success", emails });
//   } catch (err) {
//     console.log(err);
//     return new AppError(err.message, 400);
//   }
// };

// controllers/emailController.js

exports.markEmailStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // user ID
    const { query, markAs } = req.body; // e.g., query: 'from:example@email.com', markAs: 'read' or 'unread'

    if (!query || !['read', 'unread'].includes(markAs)) {
      return next(new AppError('Invalid request. Provide "query" and "markAs" as "read" or "unread".', 400));
    }

    const user = await User.findById(id);
    if (!user) return next(new AppError('User not found.', 404));

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
    oAuth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const { data } = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 1
    });

    if (!data.messages || data.messages.length === 0) {
      return next(new AppError('No email found matching that query.', 404));
    }

    const messageId = data.messages[0].id;

    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: markAs === 'read'
        ? { removeLabelIds: ['UNREAD'] }
        : { addLabelIds: ['UNREAD'] }
    });

    res.status(200).json({
      status: 'success',
      message: `Email marked as ${markAs}`,
      emailId: messageId
    });
  } catch (err) {
    console.error(err);
    next(new AppError(err.message, 500));
  }
};

exports.getOneEmailById = async (req, res, next) => {
  try {
    const email = await Email.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      email,
    });
  } catch (err) {
    next(new AppError(err.message, 404));
  }

}
