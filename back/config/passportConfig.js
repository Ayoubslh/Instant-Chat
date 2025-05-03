// config/passportConfig.js
const passport = require('passport');
const User = require('../models/user.model');  // Adjust path to your User model
const crypto = require('crypto');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/v1/auth/google",
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    // Generate a random password
    const randomPassword = crypto.randomBytes(8).toString('hex');

    User.findOrCreate({
      where: { id: profile.id },
      defaults: {
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        password: randomPassword,
        id: profile.id
      }
    })
      .then(([user, created]) => {
        console.log(user);
        return done(null, user);
      })
      .catch(err => done(err));
  }
));
// Serialize user (store user.id in session)
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id);  // Store the user ID in session
});

// Deserialize user (find user from session ID)
passport.deserializeUser((id, done) => {
  console.log("Deserializing user with ID:", id);
  User.findByPk(id)  // Using Sequelize's findByPk to find the user by ID
    .then(user => {
      console.log("Found user:", user);
      done(null, user);  // Attach the full user object to the session
    })
    .catch(err => done(err, null));  // Handle errors if user is not found
});
