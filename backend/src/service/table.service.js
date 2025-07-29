// service/table.service.js
import prisma from '../config/prisma.js';

export const createTable = async (data) => {
  return await prisma.table.create({ data });
};

export const getAllTables = async () => {
  return await prisma.table.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      room: true
    }
  });
};

export const getTableById = async (id) => {
  return await prisma.table.findUnique({
    where: { id },
    include: {
      room: true,
      devices: true,
      bookingTable: true
    }
  });
};

export const updateTable = async (id, data) => {
  return await prisma.table.update({
    where: { id },
    data
  });
};

export const deleteTable = async (id) => {
  return await prisma.table.delete({ where: { id } });
};
