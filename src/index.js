import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import os from "os";

import clientsRoutes from "./routes/clients.routes.js";
import polesRoutes from "./routes/poles.routes.js";
import incidentsRoutes from "./routes/incidents.routes.js";
import workerRoutes from "./routes/workers.routes.js";
import searchRoutes from "./routes/search.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";

import { connectMongo } from "./config/mongo.js";

const app = express();

/* 🔥 CORS BIEN CONFIGURADO */
app.use(cors({
  origin: [
    "https://telmex-appw.onrender.com",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

/* 🔥 PRE-FLIGHT (ESTO ES OBLIGATORIO) */
app.options("*", cors());

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/poles", polesRoutes);
app.use("/api/incidents", incidentsRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/search", searchRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectMongo();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });

  } catch (error) {
    console.error("Error al conectar con Mongo:", error);
    process.exit(1);
  }
})();
