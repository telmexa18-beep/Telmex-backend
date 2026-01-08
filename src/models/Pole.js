import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const poleSchema = new Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  address: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  pin_color: { type: String, default: '#007bff' },
  zone: { type: String, default: 'Huauchinango' },
  client: { type: String, ref: 'Client', default: null }
}, { timestamps: true });

export default model('Pole', poleSchema);
