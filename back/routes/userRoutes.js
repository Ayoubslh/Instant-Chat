const express = require('express');
const { protect, restrictTo } = require('../controllers/Authentication');
const {
  getOneById,
  updateUser,
  updateUserRole,
  updateUserPassword,
  deleteUser,
  getAllUsers,
} = require('../controllers/userControllers');
const Cloudinary = require('../config/cloudinary');
const upload = require('../middleware/multer');

const Router = express.Router();
Router.route('/').get(protect, restrictTo('Admin'), getAllUsers);
Router.route('/me').get(protect, getOneById);
Router.route('/:id')
  .patch(protect, upload.single('image'), Cloudinary.uploadSingle, updateUser)
  .delete(protect, deleteUser);
Router.route('/:id/role').patch(protect, restrictTo('Admin'), updateUserRole);
Router.route('/:id/password').patch(protect, updateUserPassword);

module.exports = Router;
