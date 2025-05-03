const express = require('express');
const { protect, restrictTo } = require('../controllers/Authentication');
const gmailControllers = require('../controllers/gmailControllers');
const contactControllers = require('../controllers/ContactController')
const Router = express.Router();
Router.route('/:id/linkedEmails').get(protect, gmailControllers.getLinkedEmails);
Router.route('/:id/unread').get(protect, gmailControllers.getUnreadEmails)
Router.route('/:id/update').post(protect, gmailControllers.markEmailStatus)
Router.route('/:id').get(protect, gmailControllers.getOneEmailById);
Router.route('/addemail/:id').post(protect, gmailControllers.Addemails);
// Router.route('/:id').get(protect, contactControllers.getOne).patch(protect, restrictTo('Admin'), contactControllers.updateOne).delete(protect, restrictTo('Admin'), contactControllers.deleteOne)

module.exports = Router;