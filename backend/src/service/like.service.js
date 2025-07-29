import prisma from '../config/prisma.js';

export const createLike = async (data) => {
  return await prisma.like.create({ data });
};

export const getAllLikes = async () => {
  return await prisma.like.findMany({
    include: {
      author: true,
      post: true
    }
  });
};

export const getLikeById = async (id) => {
  return await prisma.like.findUnique({
    where: { id },
    include: {
      author: true,
      post: true
    }
  });
};

export const deleteLike = async (id) => {
  return await prisma.like.delete({
    where: { id }
  });
};

export const getLikesByPostId = async (postId) => {
  return await prisma.like.findMany({
    where: { postId },
    include: {
      author: true
    }
  });
};
