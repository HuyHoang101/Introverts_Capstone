import * as electricityService from '../service/electricityData.service.js';

export const createElectricity = async (req, res) => {
  try {
    const data = await electricityService.createElectricity(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllElectricity = async (req, res) => {
  try {
    const data = await electricityService.getAllElectricity();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getElectricityById = async (req, res) => {
  try {
    const data = await electricityService.getElectricityById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateElectricity = async (req, res) => {
  try {
    const data = await electricityService.updateElectricity(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteElectricity = async (req, res) => {
  try {
    await electricityService.deleteElectricity(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
