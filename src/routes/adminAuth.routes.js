// src/routes/adminAuth.routes.js
import express from 'express';
import { requestCode, verifyCode } from '../controllers/adminAuth.controller.js';
const router = express.Router();


router.post("/request-code", requestCode);
router.post("/verify-code", verifyCode);

export default router;
