import * as waterService from '../service/waterData.service.js';

export const createWater = async (req, res) => {
  try {
    const data = await waterService.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllWater = async (req, res) => {
  try {
    const data = await waterService.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWaterById = async (req, res) => {
  try {
    const data = await waterService.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWater = async (req, res) => {
  try {
    const data = await waterService.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteWater = async (req, res) => {
  try {
    await waterService.remove(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
