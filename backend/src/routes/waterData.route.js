// src/routes/waterRoutes.js
import express from 'express';
import {
  createWater,
  getAllWater,
  getWaterById,
  updateWater,
  deleteWater
} from '../controller/waterData.controller.js';

const router = express.Router();

router.post('/', createWater);
router.get('/', getAllWater);
router.get('/:id', getWaterById);
router.put('/:id', updateWater);
router.delete('/:id', deleteWater);

export default router;
