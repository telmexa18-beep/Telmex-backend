import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// Rutas
import clientsRoutes from "./routes/clients.routes.js";
import polesRoutes from "./routes/poles.routes.js";
import incidentsRoutes from "./routes/incidents.routes.js";
import workerRoutes from "./routes/workers.routes.js";
import searchRoutes from "./routes/search.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";

import { connectMongo } from "./config/mongo.js";

const app = express();

/* =======================
   CORS (RENDER + LOCAL)
======================= */
app.use(cors({
  origin: [
    "https://telmex-appw.onrender.com", // frontend Render
    "http://localhost:3000"             // frontend local
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json());

/* =======================
   ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/poles", polesRoutes);
app.use("/api/incidents", incidentsRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/search", searchRoutes);

/* =======================
   HEALTH CHECK (OPCIONAL)
======================= */
app.get("/", (req, res) => {
  res.send("Telmex Backend OK 🚀");
});

/* =======================
   SERVER
======================= */
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectMongo();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend corriendo en puerto ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1);
  }
})();
