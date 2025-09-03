import prisma from "../config/prisma";

export const createNotification = async (data) => {
  return await prisma.notification.create({ data });
}

export const getAllNotifications = async () => {
  return await prisma.notification.findMany({
    include: {
      user: true
    }
  });
}

export const getNotificationById = async (id) => {
  return await prisma.notification.findUnique({
    where: { id },
    include: {
      user: true
    }
  });
};

export const updateNotification = async (id, data) => {
  return await prisma.notification.update({
    where: { id },
    data
  });
}

export const deleteNotification = async (id) => {
  return await prisma.notification.delete({
    where: { id }
  });
}

export const getNotificationsByUserId = async (userId) => {
  return await prisma.notification.findMany({
    where: { userId },
    include: {
      user: true
    }
  });
}