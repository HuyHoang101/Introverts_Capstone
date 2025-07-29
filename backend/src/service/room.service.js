import prisma from '../config/prisma.js';

export const createRoom = async (data) => {
  return await prisma.room.create({ data });
};

export const getAllRooms = async () => {
  return await prisma.room.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tables: true }
  });
};

export const getRoomById = async (id) => {
  return await prisma.room.findUnique({
    where: { id },
    include: { tables: true }
  });
};

export const updateRoom = async (id, data) => {
  return await prisma.room.update({
    where: { id },
    data
  });
};

export const deleteRoom = async (id) => {
  return await prisma.room.delete({ where: { id } });
};
