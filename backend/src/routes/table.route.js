// routes/table.route.js
import express from 'express';
import {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  deleteTable
} from '../controller/table.controller.js';

const router = express.Router();

router.post('/', createTable);
router.get('/', getAllTables);
router.get('/:id', getTableById);
router.put('/:id', updateTable);
router.delete('/:id', deleteTable);

export default router;
