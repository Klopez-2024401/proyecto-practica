import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongodbUri =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/service_auth_db';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongodbUri);
    console.log('Conectado a MongoDB');
    console.log('MongoDB | Base de datos:', mongoose.connection.db.databaseName);
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

export const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error.message);
    throw error;
  }
};

export default mongoose;
