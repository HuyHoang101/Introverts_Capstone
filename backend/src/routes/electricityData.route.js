import express from 'express';
import {
  createElectricity,
  getAllElectricity,
  getElectricityById,
  updateElectricity,
  deleteElectricity
} from '../controller/electricityData.controller.js';

const router = express.Router();

router.post('/', createElectricity);
router.get('/', getAllElectricity);
router.get('/:id', getElectricityById);
router.put('/:id', updateElectricity);
router.delete('/:id', deleteElectricity);

export default router;
