import prisma from '../config/prisma.js';

export const create = async (data) => {
  return await prisma.waterData.create({ data });
};

export const findAll = async () => {
  return await prisma.waterData.findMany({ orderBy: { period: 'desc' } });
};

export const findById = async (id) => {
  return await prisma.waterData.findUnique({ where: { id } });
};

export const update = async (id, data) => {
  return await prisma.waterData.update({ where: { id }, data });
};

export const remove = async (id) => {
  return await prisma.waterData.delete({ where: { id } });
};
