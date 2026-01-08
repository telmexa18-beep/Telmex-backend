import express from 'express';
import {
    getAllIncidents,
    getIncidentById,
    createIncident,
    updateIncident,
    deleteIncident,
    getViewIncidents
} from '../controllers/incidents.mongo.controller.js';

const router = express.Router();

router.get('/', getAllIncidents);
router.get('/view/all', getViewIncidents);
router.get('/:code', getIncidentById);
router.post('/', createIncident);
router.put('/:code', updateIncident);
router.delete('/:code', deleteIncident);

export default router;
