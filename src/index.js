import dotenv from "dotenv";
dotenv.config();
console.log("BREVO_API_KEY en index.js:", process.env.BREVO_API_KEY);
import express from 'express';
import cors from 'cors';
import os from 'os';
import clientsRoutes from './routes/clients.routes.js';
import polesRoutes from './routes/poles.routes.js';
import incidentsRoutes from './routes/incidents.routes.js';
import workerRoutes from './routes/workers.routes.js';
import searchRoutes from "./routes/search.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { connectMongo } from "./config/mongo.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/poles', polesRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin-auth', adminAuthRoutes);



// Iniciar el servidor después de verificar la conexión a MongoDB

(async () => {
  try {
    await connectMongo();

    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';
    for (const iface in interfaces) {
      for (const alias of interfaces[iface]) {
        if (alias.family === 'IPv4' && !alias.internal) {
          localIp = alias.address;
        }
      }
    }

    app.listen(PORT, localIp, () => {
      console.log(`Servidor corriendo en http://${localIp}:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos (Mongo):', error);
    process.exit(1);
  }
})();

