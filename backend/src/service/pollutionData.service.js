import prisma from '../config/prisma.js';

export const createPollution = async (data) => {
  return await prisma.pollutionData.create({ data });
};

export const getAllPollution = async () => {
  return await prisma.pollutionData.findMany({
    orderBy: { period: 'desc' }
  });
};

export const getPollutionById = async (id) => {
  return await prisma.pollutionData.findUnique({ where: { id } });
};

export const updatePollution = async (id, data) => {
  return await prisma.pollutionData.update({
    where: { id },
    data
  });
};

export const deletePollution = async (id) => {
  return await prisma.pollutionData.delete({ where: { id } });
};
