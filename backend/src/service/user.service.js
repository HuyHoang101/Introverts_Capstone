import prisma from '../config/prisma.js';

export const getAllUsers = () => {
  return prisma.user.findMany({
    include: {
      posts: true, // Assuming users have posts
      comments: true, // Assuming users have comments
      likes: true, // Assuming users have likes
    },
  });
};

export const getUserById = (id) => {
  return prisma.user.findUnique({ 
    where: { id },
    include: {
      posts: true, // Assuming users have posts
      comments: true, // Assuming users have comments
      likes: true, // Assuming users have likes
    },
});
};

export const createUser = (data) => {
  return prisma.user.create({ data });
};

export const updateUser = (id, data) => {
  return prisma.user.update({ where: { id }, data });
};

export const deleteUser = (id) => {
  return prisma.user.delete({ where: { id } });
};
