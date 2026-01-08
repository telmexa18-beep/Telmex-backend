import Client from '../models/Client.js';
import Worker from '../models/Worker.js';
import Pole from '../models/Pole.js';
import Incident from '../models/Incident.js';

export const search = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Búsqueda vacía' });
  }

  const searchRegex = new RegExp(q, 'i');

  try {
    const [clients, workers, poles, incidents] = await Promise.all([
      Client.find({ $or: [{ name: searchRegex }, { email: searchRegex }, { address: searchRegex }] }).lean(),
      Worker.find({ $or: [{ first_name: searchRegex }, { last_name: searchRegex }, { email: searchRegex }] }).select('-password').lean(),
      Pole.find({ $or: [{ code: searchRegex }, { title: searchRegex }, { description: searchRegex }, { address: searchRegex }] }).lean(),
      Incident.find({ description: searchRegex })
        .populate('client', 'name')
        .populate('worker', 'first_name last_name')
        .populate('pole', 'code title')
        .lean()
    ]);

    res.json({
      success: true,
      data: {
        clients: { count: clients.length, results: clients },
        workers: { count: workers.length, results: workers },
        poles: { count: poles.length, results: poles },
        incidents: { count: incidents.length, results: incidents }
      }
    });
  } catch (err) {
    console.error('Error en búsqueda (mongo):', err);
    res.status(500).json({ success: false, message: 'Error en la búsqueda' });
  }
};
