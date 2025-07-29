// controller/table.controller.js
import * as tableService from '../service/table.service.js';

export const createTable = async (req, res) => {
  try {
    const table = await tableService.createTable(req.body);
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllTables = async (req, res) => {
  try {
    const tables = await tableService.getAllTables();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTableById = async (req, res) => {
  try {
    const table = await tableService.getTableById(req.params.id);
    if (!table) return res.status(404).json({ error: 'Table not found' });
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTable = async (req, res) => {
  try {
    const table = await tableService.updateTable(req.params.id, req.body);
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTable = async (req, res) => {
  try {
    await tableService.deleteTable(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
