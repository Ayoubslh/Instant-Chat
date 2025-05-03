const express = require('express');
const { login, signup, logout, signToken, sendResetCode, verifyResetCode, resetPassword, protect } = require('../controllers/Authentication');
const Cloudinary = require('../config/cloudinary');
const upload = require("../middleware/multer");
const passport = require('passport');
const Router = express.Router();
require('dotenv').config();

Router.route('/signup').post(upload.single("image"), Cloudinary.uploadSingle, signup);
Router.route('/login').post(login);
Router.route('/logout').get(protect, logout);
Router.route('/forgot-password').post(sendResetCode);
Router.route('/verify-reset-code').post(verifyResetCode);
Router.route('/reset-password').post(resetPassword);
// Router.route('/:id').get().patch().delete();



//redirects the user to Google’s OAuth consent screen
Router.route('/google').get(passport.authenticate('google', {
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
  ],
  accessType: 'offline',
  prompt: 'consent'
}));


//google redirect user the the url : api/v1/auth/google/callback
const cookieExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN || 7;

Router.route('/callback').get(
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = signToken(req.user._id)
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
    });
    res.redirect(`http://localhost:5173/auth/login/continue-with-google`);
  });

module.exports = Router;