const { fetchUnreadEmails } = require('../utils/emailUtils');
// import { metadata } from './../node_modules/googleapis/build/src/apis/datastore/v1.d';
// const { type } = require('./../node_modules/gaxios/node_modules/agent-base/dist/helpers.d');
const { processEmail } = require('../config/emailprocessingagent');
const { runCalendarAgent } = require('../config/scheduleagent');
const { handleInput } = require('../config/promptagent');
const { writeEmail } = require('../config/emaildraftingagent');

const { push } = require('langchain/hub');
const Email = require('../models/emailModel');
const APIFeautures = require('../utils/feautures');

exports.processagent = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const emails = await fetchUnreadEmails(id);
    if (!Array.isArray(emails)) {
      return res.status(400).json({ error: 'Emails must be an array' });
    }

    const results = await Promise.all(
      emails.map(async email => {
        try {
          return await processEmail(email);
        } catch (error) {
          console.error('Error processing email:', error);
          return { error: `Failed to process email: ${error.message}` };
        }
      })
    );

    // Merge emails and results
    const merged = emails.map((email, index) => {
      const result = results[index];

      return {
        subject: email.subject,
        from: email.from,
        plainText: email.plainText,
        summary: result.summary,
        category: result.category,
        priority: result.priority,
        actionItems: result.actionItems,
        user: req.params.id,
      };
    });
    let finalEmails;
    if (!req.query.priority && !req.query.category && !req.query.search) {
      await Email.deleteMany();
      finalEmails = await Email.create(merged, { ordered: false });
    } else {
      console.log(req.query);
      const gmails = new APIFeautures(Email.find(), req.query).filter();
      finalEmails = await gmails.query.exec();
    }
    const data = await Email.find({ user: req.params.id });
    let metadata = [];
    for (const email of data) {
      if (!metadata.includes(email.category.type)) {
        metadata.push(email.category.type);
      }
    }
    return res.status(200).json({
      status: 'success',
      metadata,
      Emails: finalEmails,
    });
  } catch (error) {
    console.error('Error processing emails:', error);

    return res
      .status(500)
      .json({ error: 'Failed to process one or more emails' });
  }
};

exports.writeEmail = async (req, res) => {
  try {
    const input = req.body.input;
    if (!input || typeof input !== 'string') {
      return res
        .status(400)
        .json({ error: 'Input is required and must be a string' });
    }

    const result = await writeEmail(input);
    res.json({ result });
  } catch (error) {
    console.error('Error writing email:', error);
    res.status(500).json({ error: `Failed to write email: ${error.message}` });
  }
};

exports.scheduleCalendar = async (req, res) => {
  try {
    const input = req.body?.input?.trim?.();

    if (!input || typeof input !== 'string') {
      return res
        .status(400)
        .json({ error: 'Input is required and must be a non-empty string' });
    }

    const { result, viewResult } = await runCalendarAgent(
      input,
      'What meetings do I have today?'
    );

    return res.status(200).json({
      result: result || 'No event created',
      viewResult: viewResult || 'No events found',
    });
  } catch (error) {
    console.error('Error scheduling calendar:', error);
    return res.status(500).json({
      error: 'Failed to schedule calendar',
      details: error.message,
    });
  }
};
// Example of how to integrate the email sender in your EprocessAgentController.js file

const {
  sendCustomEmailFromExternalSource,
} = require('../config/sendemailagent');

exports.sendCustomEmail = async (req, res, next) => {
  try {
    // Get user ID from params or req.user (from auth middleware)
    const userId = req.params.id || req.user.id;

    // Check if email data exists in request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError('Email data is required', 400));
    }

    // Add user ID and prepare data structure expected by email sender
    req.body.id = userId;

    // If the email data is at the top level, wrap it in externalData object
    if (req.body.to && req.body.subject) {
      req.body = {
        id: userId,
        externalData: {
          to: req.body.to,
          subject: req.body.subject,
          body: req.body.body || '',
        },
      };
    }

    console.log('Sending email with data:', JSON.stringify(req.body));

    // Call the email sender function
    const result = await sendCustomEmailFromExternalSource(req, res);

    // If the function returns a result instead of directly responding
    if (result && !res.headersSent) {
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error('Error in sendCustomEmail controller:', error);
    if (!res.headersSent) {
      return next(new AppError(`Failed to send email: ${error.message}`, 500));
    }
  }
};

exports.handleInput = async (req, res) => {
  try {
    const input = req.body.input;
    if (!input || typeof input !== 'string') {
      return res
        .status(400)
        .json({ error: 'Input is required and must be a string' });
    }

    const result = await handleInput(input);
    res.json({ result });
  } catch (error) {
    console.error('Error handling input:', error);
    res.status(500).json({ error: `Failed to handle input: ${error.message}` });
  }
};
