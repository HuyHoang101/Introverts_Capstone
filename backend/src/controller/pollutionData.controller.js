import * as pollutionService from '../service/pollutionData.service.js';

export const createPollution = async (req, res) => {
  try {
    const data = await pollutionService.createPollution(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllPollution = async (req, res) => {
  try {
    const data = await pollutionService.getAllPollution();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPollutionById = async (req, res) => {
  try {
    const data = await pollutionService.getPollutionById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePollution = async (req, res) => {
  try {
    const data = await pollutionService.updatePollution(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePollution = async (req, res) => {
  try {
    await pollutionService.deletePollution(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
