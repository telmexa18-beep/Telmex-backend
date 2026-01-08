import express from 'express';
import {
    getAllWorkers,
    getWorkerById,
    createWorker,
    updateWorker,
    deleteWorker,
    getAllWorkersWithPasswords,
    bulkCreateWorkers
} from '../controllers/workers.mongo.controller.js';

const router = express.Router();

// Rutas específicas PRIMERO (antes de :id)
router.get('/debug/passwords', getAllWorkersWithPasswords);  // GET /api/workers/debug/passwords (SOLO DESARROLLO)

// Rutas generales
router.get('/', getAllWorkers);           // GET /api/workers
router.get('/:code', getWorkerById);       // GET /api/workers/:code
router.post('/', createWorker);          // POST /api/workers
router.post('/bulk', bulkCreateWorkers); // POST /api/workers/bulk
router.put('/:code', updateWorker);        // PUT /api/workers/:code
router.delete('/:code', deleteWorker);     // DELETE /api/workers/:code

export default router;
