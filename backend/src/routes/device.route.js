// routes/device.route.js
import express from 'express';
import {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  getDevicesByTable
} from '../controller/device.controller.js';

const router = express.Router();

router.post('/', createDevice);
router.get('/', getAllDevices);
router.get('/:id', getDeviceById);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);
router.get('/table/:tableId', getDevicesByTable); // Get devices by tableId

export default router;
