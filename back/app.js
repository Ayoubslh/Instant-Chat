const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const notifRouter = require('./routes/notificationRoutes');
const contactRouter = require('./routes/contactRoutes')
const chatRouter = require('./routes/ChatRoute');
const gmailRouter = require('./routes/gmailRoutes')
const agentRouter = require('./routes/agentRoute')
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const path = require('path');
const { createServer } = require("http");
// const routes = require('./routes'); // Centralized routes
require('dotenv').config(); // Load environment variables

const app = express();
const httpServer = createServer(app);
// Set up session middleware
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://cdn.socket.io");
    next();
});

app.use(session({
    secret: 'your_secret_key',  // You can change this to a more secure secret
    resave: false,              // Don't save session if unmodified
    saveUninitialized: true,    // Store sessions even if they're uninitialized
    cookie: { secure: false }   // Set to true if using https, or in production environments
}));
app.use(cors({
    origin: ['http://localhost:5173', 'https://async-iota.vercel.app'], // remove trailing slashes
    credentials: true,
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());
// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
// Mount routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/notifications', notifRouter);
app.use('/api/v1/contacts', contactRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/gmail', gmailRouter)
app.use('/api/v1/agent', agentRouter)
// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: 'Resource not found',
    });
});

// Global error handler (optional, centralized error handling)
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: "fail",
        message: err.message || 'Server Error',
    });
});

// Export the app instance
module.exports = httpServer;
