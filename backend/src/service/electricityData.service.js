import prisma from '../config/prisma.js';

export const createElectricity = async (data) => {
  return await prisma.electricityData.create({ data });
};

export const getAllElectricity = async () => {
  return await prisma.electricityData.findMany({
    orderBy: { period: 'desc' }
  });
};

export const getElectricityById = async (id) => {
  return await prisma.electricityData.findUnique({ where: { id } });
};

export const updateElectricity = async (id, data) => {
  return await prisma.electricityData.update({
    where: { id },
    data
  });
};

export const deleteElectricity = async (id) => {
  return await prisma.electricityData.delete({ where: { id } });
};
