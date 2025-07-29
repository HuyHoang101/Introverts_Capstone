// service/device.service.js
import prisma from '../config/prisma.js';

export const createDevice = async (data) => {
  return await prisma.device.create({ data });
};

export const getAllDevices = async () => {
  return await prisma.device.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      table: true
    }
  });
};

export const getDeviceById = async (id) => {
  return await prisma.device.findUnique({
    where: { id },
    include: {
      table: true
    }
  });
};

export const updateDevice = async (id, data) => {
  return await prisma.device.update({
    where: { id },
    data
  });
};

export const deleteDevice = async (id) => {
  return await prisma.device.delete({ where: { id } });
};

// Optional: Get devices by table
export const getDevicesByTable = async (tableId) => {
  return await prisma.device.findMany({
    where: { tableId },
    orderBy: { createdAt: 'desc' }
  });
};
