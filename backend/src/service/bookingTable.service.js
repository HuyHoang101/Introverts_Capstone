// service/bookingTable.service.js
import prisma from '../config/prisma.js';

export const createBooking = async (data) => {
  return await prisma.bookingTable.create({ data });
};

export const getAllBookings = async () => {
  return await prisma.bookingTable.findMany({
    orderBy: { startTime: 'desc' },
    include: {
      user: true,
      table: true
    }
  });
};

export const getBookingById = async (id) => {
  return await prisma.bookingTable.findUnique({
    where: { id },
    include: {
      user: true,
      table: true
    }
  });
};

export const updateBooking = async (id, data) => {
  return await prisma.bookingTable.update({
    where: { id },
    data
  });
};

export const deleteBooking = async (id) => {
  return await prisma.bookingTable.delete({
    where: { id }
  });
};

// Optional: lấy lịch đặt theo tableId
export const getBookingsByTable = async (tableId) => {
  return await prisma.bookingTable.findMany({
    where: { tableId },
    orderBy: { startTime: 'asc' },
    include: {
      user: true
    }
  });
};
