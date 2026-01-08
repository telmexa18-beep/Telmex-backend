import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const clientSchema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  zone: { type: String },
  registration_date: { type: Date, default: Date.now }
}, { timestamps: false });

export default model('Client', clientSchema);
