const express = require('express');
const { protect, restrictTo } = require('../controllers/Authentication');
const notifControllers = require('../controllers/notificationControllers')
const Router = express.Router();

Router.route('/').post(protect, restrictTo('Admin'), notifControllers.createNotif).delete(protect, notifControllers.deleteAll)
Router.route('/user/:id').get(protect, notifControllers.getAllForSpecificUser)
Router.route('/:id').get(protect, notifControllers.getOne).patch(protect, notifControllers.updateOne).delete(protect, notifControllers.deleteOne);


module.exports = Router;