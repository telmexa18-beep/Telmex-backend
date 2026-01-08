import Pole from '../models/Pole.js';

export const getAllPoles = async (req, res) => {
  try {
    const { zone } = req.query;
    let query = {};
    if (zone) {
      query.zone = { $regex: zone, $options: 'i' };
    }
    const poles = await Pole.find(query).lean();
    res.json({ success: true, data: poles });
  } catch (err) {
    console.error('Error al obtener postes (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al obtener postes' });
  }
};

export const getPoleByCode = async (req, res) => {
  try {
    const { code } = req.params;

    // Buscar poste por el campo "code"
    const pole = await Pole.findOne({ code })
      .populate('client', 'name email phone')
      .lean();

    if (!pole) {
      return res.status(404).json({
        success: false,
        message: 'Poste no encontrado con ese código'
      });
    }

    return res.json({
      success: true,
      data: pole
    });

  } catch (error) {
    console.error('Error al obtener poste por código:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener poste'
    });
  }
};

export const createPole = async (req, res) => {
  const { code, title, description, address, latitude, longitude, pin_color, zone, client } = req.body;
  if (!code || !title || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ success: false, message: 'code, title, latitude y longitude son requeridos' });
  }

  try {
    const exists = await Pole.findOne({ code });
    if (exists) return res.status(400).json({ success: false, message: 'El código del poste ya existe' });

    const pole = new Pole({ code, title, description, address, latitude, longitude, pin_color: pin_color || '#007bff', zone: zone || 'Huauchinango', client: client || null });
    await pole.save();

    res.status(201).json({ success: true, message: 'Poste creado correctamente', data: pole });
  } catch (err) {
    console.error('Error al crear poste (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al crear poste' });
  }
};

export const updatePole = async (req, res) => {
  try {
    const { code } = req.params; // <-- ahora viene en la URL
    const updates = req.body;

    const pole = await Pole.findOne({ code });
    if (!pole) {
      return res.status(404).json({
        success: false,
        message: 'Poste no encontrado con ese código'
      });
    }

    // Actualizar solo campos enviados
    Object.keys(updates).forEach(field => {
      pole[field] = updates[field];
    });

    await pole.save();

    res.json({
      success: true,
      message: 'Poste actualizado correctamente',
      data: pole
    });

  } catch (err) {
    console.error('Error al actualizar poste (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al actualizar poste' });
  }
};

export const deletePole = async (req, res) => {
  try {
    const { code } = req.params;

    const result = await Pole.findOneAndDelete({ code });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Poste no encontrado con ese código'
      });
    }

    res.json({
      success: true,
      message: 'Poste eliminado correctamente'
    });

  } catch (err) {
    console.error('Error al eliminar poste (mongo):', err);
    res.status(500).json({ success: false, message: 'Error al eliminar poste' });
  }
};
