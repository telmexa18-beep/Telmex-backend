import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const incidentSchema = new Schema({
  code : { type: String, required: true, unique: true },
  description: { type: String, required: true },
  report_date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pendiente', 'En progreso', 'Resuelto'], default: 'Pendiente' },
  priority: { type: String, enum: ['Baja', 'Media', 'Alta'], default: 'Media' },
  client: { type: String, ref: 'Client', default: null },
  worker: { type: String, ref: 'Worker', default: null },
  pole: { type: String, ref: 'Pole', default: null }
}, { timestamps: false });

export default model('Incident', incidentSchema);