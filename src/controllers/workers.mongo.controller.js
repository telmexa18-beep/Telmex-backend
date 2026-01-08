import bcrypt from 'bcryptjs';
import Worker from '../models/Worker.js';

export const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().select('-password').lean();
    res.json({ success: true, data: workers });
  } catch (err) {
    console.error('Error al obtener trabajadores (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al obtener trabajadores' });
  }
};

export const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findOne({ code: req.params.code }).select('-password').lean();
    if (!worker) return res.status(404).json({ success: false, message: 'Trabajador no encontrado' });
    res.json({ success: true, data: worker });
  } catch (err) {
    console.error('Error al obtener trabajador (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al obtener trabajador' });
  }
};

export const createWorker = async (req, res) => {
  const { code, name, last_name, email, password, phone, zone, role } = req.body;
  if (!code || !name || !last_name  || !email || !password) {
    return res.status(400).json({ success: false, message: 'name, last_name, email y password son requeridos' });
  }

  try {
    const exists = await Worker.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ success: false, message: 'El email ya está registrado' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const worker = new Worker({ code, name, last_name, email: email.toLowerCase().trim(), password: hashedPassword, phone, zone: zone, role: role});
    await worker.save();

    res.status(201).json({ success: true, message: 'Trabajador creado correctamente', data: { id: worker._id, code, name, last_name, email: worker.email, phone, zone: worker.zone, role: worker.role } });
  } catch (err) {
    console.error('Error al crear trabajador (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al crear trabajador' });
  }
};

export const updateWorker = async (req, res) => {
  const { name, last_name, email, phone, role, zone } = req.body;
  try {
    const worker = await Worker.findOne({ code: req.params.code });
    if (!worker) return res.status(404).json({ success: false, message: 'Trabajador no encontrado' });
    if (name !== undefined) worker.name = name;
    if (last_name !== undefined) worker.last_name = last_name;
    if (email !== undefined) worker.email = email.toLowerCase().trim();
    if (phone !== undefined) worker.phone = phone;
    if (role !== undefined) worker.role = role;
    if (zone !== undefined) worker.zone = zone;

    await worker.save();

    res.json({ success: true, message: 'Trabajador actualizado correctamente', data: { code: worker.code, name: worker.name, email: worker.email, last_name: worker.last_name, phone: worker.phone, role: worker.role, zone: worker.zone } });
  } catch (err) {
    console.error('Error al actualizar trabajador (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al actualizar trabajador' });
  }
};

export const deleteWorker = async (req, res) => {
  try {
    const result = await Worker.findOneAndDelete({ code: req.params.code });
    if (!result) return res.status(404).json({ success: false, message: 'Trabajador no encontrado' });
    res.json({ success: true, message: 'Trabajador eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar trabajador (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al eliminar trabajador' });
  }
};

// SOLO PARA DESARROLLO: Ver contraseñas (hashes)
export const getAllWorkersWithPasswords = async (req, res) => {
  try {
    const rows = await Worker.find().select('name last_name email password').lean();
    res.json({ success: true, data: rows, warning: 'Este endpoint solo debe existir en desarrollo' });
  } catch (err) {
    console.error('Error al obtener trabajadores (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al obtener trabajadores' });
  }
};

// Crear varios workers desde un arreglo de JSON
export const bulkCreateWorkers = async (req, res) => {
  const workers = req.body;
  if (!Array.isArray(workers) || workers.length === 0) {
    return res.status(400).json({ success: false, message: 'Se requiere un arreglo de trabajadores' });
  }
  try {
    const results = [];
    for (const w of workers) {
      if (!w.code || !w.name || !w.last_name || !w.email || !w.password) {
        results.push({ code: w.code, success: false, message: 'Faltan campos requeridos' });
        continue;
      }
      const exists = await Worker.findOne({ email: w.email.toLowerCase().trim() });
      if (exists) {
        results.push({ code: w.code, success: false, message: 'El email ya está registrado' });
        continue;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(w.password, salt);
      const worker = new Worker({
        code: w.code,
        name: w.name,
        last_name: w.last_name,
        email: w.email.toLowerCase().trim(),
        password: hashedPassword,
        phone: w.phone,
        zone: w.zone,
        role: w.role || 'Trabajador'
      });
      await worker.save();
      results.push({ code: w.code, success: true });
    }
    res.status(201).json({ success: true, results });
  } catch (err) {
    console.error('Error en bulkCreateWorkers:', err);
    res.status(500).json({ success: false, message: 'Error al crear trabajadores masivamente' });
  }
};

