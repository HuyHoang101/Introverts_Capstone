import prisma from '../config/prisma.js';

export const createComment = async (data) => {
  return await prisma.comment.create({ data });
};

export const getAllComments = async () => {
  return await prisma.comment.findMany({
    include: {
      author: true,
      post: true
    }
  });
};

export const getCommentById = async (id) => {
  return await prisma.comment.findUnique({
    where: { id },
    include: {
      author: true,
      post: true
    }
  });
};

export const updateComment = async (id, data) => {
  return await prisma.comment.update({
    where: { id },
    data
  });
};

export const deleteComment = async (id) => {
  return await prisma.comment.delete({
    where: { id }
  });
};

export const getCommentsByPostId = async (postId) => {
  return await prisma.comment.findMany({
    where: { postId },
    include: {
      author: true
    }
  });
};
