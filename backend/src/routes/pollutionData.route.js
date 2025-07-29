// routes/pollutionData.route.js
import express from 'express';
import {
  createPollution,
  getAllPollution,
  getPollutionById,
  updatePollution,
  deletePollution
} from '../controller/pollutionData.controller.js';

const router = express.Router();

router.post('/', createPollution);
router.get('/', getAllPollution);
router.get('/:id', getPollutionById);
router.put('/:id', updatePollution);
router.delete('/:id', deletePollution);

export default router;
