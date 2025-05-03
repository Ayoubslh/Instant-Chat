const httpServer = require('./app'); // Import the app instance
const connectDB = require('./config/connectDb'); // Database connection logic
require('dotenv').config(); // Load environment variables
const { initSocket } = require('./config/socketIO');
const io = initSocket(httpServer);
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to the database
        await connectDB();
        console.log('Database connected successfully');
    

        // Start the server
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1); // Exit with failure code
    }
};

// Start the app
startServer(() => {
    console.log('env variables:', process.env.GROQ_API_KEY, process.env.GOOGLE_API_KEY);
    console.log('Server started successfully');
})
