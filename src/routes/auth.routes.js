import express from 'express';
import { login, verifyToken, sendResetCode, verifyResetCode, setNewPassword } from '../controllers/auth.mongo.controller.js';

const router = express.Router();

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// GET /api/auth/verify - Verificar token
router.get('/verify', verifyToken);

router.post("/send-reset-code", sendResetCode);
router.post("/verify-reset-code", verifyResetCode);
router.post("/set-new-password", setNewPassword);

export default router;