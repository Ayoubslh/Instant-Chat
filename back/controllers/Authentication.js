const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const AppError = require('../utils/AppError');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables
// Generate JWT
console.log();
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
});
// Send Token Response
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    // Exclude password from response
    user.password = undefined;
    // Send token via secure cookie
    const cookieExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN || 7; // Default to 7 days if not set
    // Send token via secure cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
    });
    const safeUser = user.toObject();
    delete safeUser.resetCode;
    delete safeUser.resetCodeExpiresAt;
    // JSON response
    res.status(statusCode).json({
        status: 'success',
        data: safeUser,
    });
};


// User Signup
const signup = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            throw new AppError("this email is already in use login using it", 400);
        }
        if (req.image) {
            req.body.image = req.image
        }
        const newUser = await User.create(req.body);
        console.log(newUser);
        createSendToken(newUser, 201, res);
    } catch (err) {
        console.log(err.statusCode);
        next(err);
    }
};



// User Login
const login = async (req, res, next) => {
    console.log(req.params);
    try {
        const { email, password } = req.body;

        // Check email and password
        if (!email || !password) {
            throw new AppError('Please provide email and password', 400);
        }

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password -createdAt -updatedAt -__v');
        // Verify user and password
        if (!user || !(await user.correctPassword(password, user.password))) {
            throw new AppError('Please provide correct email or password', 400);
        }

        // Send token to user
        createSendToken(user, 200, res);
    } catch (err) {
        next(new AppError('Login failed', 500));
    }
};

const logout = (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // use 'true' in production
        sameSite: 'Strict', // or 'Lax' depending on your frontend setup
    });
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};


//forgot password function
const sendResetCode = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ status: 'fail', message: 'Email not found' });
        }

        // Generate a 6-digit random code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        await User.updateOne(
            { email: req.body.email },
            {
                resetCode,
                resetCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000)
            }
        );
        // const txtTamplate = textTemplate(user.name, resetCode);
        // const template = htmlTemplate(user.name, resetCode);

        // Send the reset code to the user's email via Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service provider
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            text: `this is your reset code : ${resetCode}`
            // text: txtTamplate,
            // html: template,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ status: 'success', message: 'Password reset code sent to email' });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ status: "fail", message: 'Server error' });
    }
}
//verify reset code 
const verifyResetCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        // Check if the code matches the one sent to the email
        //1 get user from the db
        const user = await User.findOne({ email });
        //2 check the code and expiration time
        if (user.resetCode === code && new Date() < user.resetCodeExpiresAt) {
            console.log("ok");
            return res.status(200).json({ status: "success", message: 'Code verified successfully' });
        }

        return res.status(400).json({ status: "fail", message: 'Invalid code' });
    } catch (err) {
        return res.status(500).json({ status: 'fail', message: 'Server error' });
    }
}
//reset password function
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: "fail", message: 'Email not found' });
        }

        // Update the user's password 
        user.password = newPassword;
        user.confirmPassword = newPassword;
        user.resetCode = null;
        user.resetCodeExpiresAt = null;
        await user.save();
        const safeUser = user.toObject();
        delete safeUser.password;
        delete safeUser.resetCode;
        delete safeUser.resetCodeExpiresAt;
        delete safeUser.createdAt;
        delete safeUser.updatedAt;
        delete safeUser.__v;
        return res.status(200).json({ status: "success", message: 'Password reset successfully', user: safeUser });
    } catch (err) {
        return res.status(500).json({ status: "fail", message: 'Server error' });
    }
}

// Protect Route
const protect = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.cookies.jwt;

        // Check token presence
        if (!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401));
        }

        // Verify token
        let decoded;
        try {
            decoded = await jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new AppError('Your session has expired. Please log in again.', 401);
            }
            throw new AppError('Invalid token. Please log in again.', 401);
        }

        // Find user by decoded ID
        const freshUser = await User.findById(decoded.id);
        if (!freshUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        // Check if user changed password
        if (freshUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password. Please log in again.', 401));
        }

        // Attach user to request
        req.user = freshUser;
        next();
    } catch (error) {
        next(error);
    }
};


// Restrict Access to Roles
const restrictTo = (...roles) => (req, res, next) => {
    try {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        console.log("okk");
        next();
    } catch (error) {
        next(error);
    }
};


//passport strategy for any one authenticated with google 
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/v1/auth/callback",
    passReqToCallback: true,
    accessType: 'offline',
    prompt: 'consent',
    scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify',
    ],
},
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            console.log(request);
            console.log(refreshToken);
            const randomPassword = crypto.randomBytes(8).toString('hex');

            // Step 1: Check if a user exists with the email (regardless of googleId)
            let user = await User.findOne({ email: profile.emails?.[0]?.value });

            // Step 2: If user with the email exists but no googleId, update the googleId
            if (user && !user.googleId) {
                await User.updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            googleId: profile.id,
                            accessToken: accessToken,
                            refreshToken: refreshToken || user.refreshToken
                        }
                    }
                );

            }
            // Step 3: If no user exists with this email (new user), create a new one
            if (!user) {
                user = await User.create({
                    fullName: profile.displayName,
                    email: profile.emails?.[0]?.value,
                    password: randomPassword, // Random password for the user
                    confirmPassword: randomPassword, // Same as above
                    googleId: profile.id, // Add googleId here
                    accessToken,
                    refreshToken,
                });
            }

            return done(null, user);

        } catch (err) {
            return done(err, false);
        }
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


module.exports = { login, signup, logout, restrictTo, protect, createSendToken, signToken, sendResetCode, verifyResetCode, resetPassword }