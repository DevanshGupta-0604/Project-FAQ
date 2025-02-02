import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env

// Connecting to MongoDB database instance
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.Database_URI);
    console.log('DATABASE CONNECTED');
  } catch (err) {
    console.log('ERROR :', err);
  }
};

export default dbConnection;
