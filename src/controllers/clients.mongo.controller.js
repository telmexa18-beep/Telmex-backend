import Client from "../models/Client.js";

// Obtener todos los clientes
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los clientes"
    });
  }
};

// Obtener un cliente por código
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({ code: req.params.code });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el cliente"
    });
  }
};

// Crear nuevo cliente
export const createClient = async (req, res) => {
  try {
    const newClient = new Client(req.body);
    await newClient.save();

    res.status(201).json({
      success: true,
      message: "Cliente creado exitosamente",
      data: newClient
    });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear el cliente"
    });
  }
};

// Actualizar cliente
export const updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findOneAndUpdate(
      { code: req.params.code },
      req.body,
      { new: true } // devuelve el documento actualizado
    );

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    res.json({
      success: true,
      message: "Cliente actualizado correctamente",
      data: updatedClient
    });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el cliente"
    });
  }
};

// Eliminar cliente
export const deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findOneAndDelete({ code: req.params.code });

    if (!deletedClient) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado"
      });
    }

    res.json({
      success: true,
      message: "Cliente eliminado correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el cliente"
    });
  }
};
