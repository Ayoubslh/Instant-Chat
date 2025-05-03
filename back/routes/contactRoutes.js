const express = require('express');
const { protect, restrictTo } = require('../controllers/Authentication');
const contactControllers = require('../controllers/ContactController')
const Router = express.Router();

Router.route('/').post(protect, contactControllers.createContact)
Router.route('/user/:id').get(protect, contactControllers.getAllForSpecificUser).delete(protect, restrictTo('Admin'), contactControllers.deleteAll)

Router.route('/:id').get(protect, contactControllers.getOne).patch(protect, restrictTo('Admin'), contactControllers.updateOne).delete(protect, restrictTo('Admin'), contactControllers.deleteOne)

module.exports = Router;