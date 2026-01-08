import Incident from '../models/Incident.js';

export const getAllIncidents = async (req, res) => {
  try {
    const { zone, poles } = req.query;
    let poleCodes = [];
    if (zone) {
      // Buscar los postes de la zona
      const Pole = (await import('../models/Pole.js')).default;
      const polesInZone = await Pole.find({ zone }).select('code').lean();
      poleCodes = polesInZone.map(p => p.code);
    }
    if (poles) {
      // Si se pasa una lista de postes, usarla
      poleCodes = poleCodes.concat(poles.split(','));
    }
    let query = {};
    if (poleCodes.length > 0) {
      query.pole = { $in: poleCodes };
    }
    const incidents = await Incident.find(query).lean();
    res.json({ success: true, data: incidents });
  } catch (err) {
    console.error('Error al obtener incidencias (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al obtener incidencias' });
  }
};

export const getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findOne({ code: req.params.code })
      .lean();
    if (!incident) return res.status(404).json({ success: false, message: 'Incidencia no encontrada' });
    res.json({ success: true, data: incident });
  } catch (err) {
    console.error('Error al obtener incidencia (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al obtener incidencia' });
  }
};

export const createIncident = async (req, res) => {
  const { code ,description, report_date, status, priority, client, worker, pole } = req.body;
  if (!description) return res.status(400).json({ success: false, message: 'La descripción es requerida' });

  try {
    const incident = new Incident({
      code : code,
      description: description,
      report_date: report_date || new Date(),
      status: status || 'Pendiente',
      priority: priority || 'Media',
      client: client || null,
      worker: worker || null,
      pole: pole || null
    });
    await incident.save();

    res.status(201).json({ success: true, message: 'Incidencia creada correctamente', data: incident });
  } catch (err) {
    console.error('Error al crear incidencia (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al crear incidencia' });
  }
};

export const updateIncident = async (req, res) => {
  const { description, status, priority, client, worker, pole } = req.body;
  try {
    const incident = await Incident.findOne({ code: req.params.code });
    if (!incident) return res.status(404).json({ success: false, message: 'Incidencia no encontrada' });

    if (description !== undefined) incident.description = description;
    if (status !== undefined) incident.status = status;
    if (priority !== undefined) incident.priority = priority;
    if (client !== undefined) incident.client = client;
    if (worker !== undefined) incident.worker = worker;
    if (pole !== undefined) incident.pole = pole;

    await incident.save();
    res.json({ success: true, message: 'Incidencia actualizada correctamente', data: incident });
  } catch (err) {
    console.error('Error al actualizar incidencia (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al actualizar incidencia' });
  }
};

export const deleteIncident = async (req, res) => {
  try {
    const result = await Incident.findOneAndDelete({ code: req.params.code });
    if (!result) return res.status(404).json({ success: false, message: 'Incidencia no encontrada' });
    res.json({ success: true, message: 'Incidencia eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar incidencia (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al eliminar incidencia' });
  }
};

// Vista mejorada: obtener incidencias con información completa
export const getViewIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().lean();
    
    // Hacer lookups manuales sin usar populate
    const view = incidents.map(i => ({
      incident_id: i._id,
      code: i.code,
      description: i.description,
      report_date: i.report_date,
      status: i.status,
      priority: i.priority,
      client_code: i.client || null,
      worker_code: i.worker || null,
      pole_code: i.pole || null
    }));

    res.json({ success: true, data: view });
  } catch (err) {
    console.error('Error al obtener vista de incidencias (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al obtener vista de incidencias' });
  }
};
