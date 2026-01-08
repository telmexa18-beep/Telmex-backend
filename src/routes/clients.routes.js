import express from 'express';
import {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
} from '../controllers/clients.mongo.controller.js';

const router = express.Router();

router.get('/', getAllClients);
router.get('/:code', getClientById);
router.post('/', createClient);
router.put('/:code', updateClient);
router.delete('/:code', deleteClient);

export default router;
