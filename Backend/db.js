const mongoose = require('mongoose');

const connectionString = process.env.MONGO_URL;

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const connectToDatabase = async() => {
    try {
        if (!connectionString) {
            throw new Error('MONGO_URL is not defined in environment variables');
        }
        
        await mongoose.connect(connectionString, connectionParams);
        console.log('Connected to MongoDB successfully!');
        
        // Listen to connection events
        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit if we can't connect to database
    }
};

module.exports = connectToDatabase;