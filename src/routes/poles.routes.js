import express from 'express';
import {
    getAllPoles,
    getPoleByCode,
    createPole,
    updatePole,
    deletePole
} from '../controllers/poles.mongo.controller.js';

const router = express.Router();

router.get('/', getAllPoles);
router.get('/:code', getPoleByCode);
router.post('/', createPole);
router.put('/:code', updatePole);
router.delete('/:code', deletePole);

export default router;
