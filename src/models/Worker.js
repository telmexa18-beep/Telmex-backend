import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const workerSchema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String },
  zone: { type: String },
  role: { type: String, default: 'Trabajador' },
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
  resetCodeVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default model('Worker', workerSchema);
