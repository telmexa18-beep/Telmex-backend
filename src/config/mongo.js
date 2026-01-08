import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

export const connectMongo = async () => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI no está definido en .env');
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      // useNewUrlParser and useUnifiedTopology are defaults in Mongoose v6+
      // Options left explicit for clarity
      dbName: 'telmex_app'
    });
    console.log('Conexión a MongoDB Atlas establecida');
  } catch (error) {
    console.error('Error conectando a MongoDB Atlas:', error);
    throw error;
  }
};
