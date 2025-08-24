import prisma from '../config/prisma.js';

export const getAllPosts = () => {
  return prisma.post.findMany({
    include: {
      author: true,
      Comment: true,
      like: true,
    },
  });
};

export const getPostById = (id) => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      Comment: true,
      like: true,
    },
  });
};

export const getPostsByAuthorId = (authorId) => {
  return prisma.post.findMany({
    where: { authorId },
    include: {
      author: true,
      Comment: true,
      like: true,
    },
  });
};

export const createPost = (data) => {
  return prisma.post.create({
    data,
    include: {
      author: true,
      Comment: true,
      like: true,
    },
  });
};

export const updatePost = (id, data) => {
  return prisma.post.update({
    where: { id },
    data,
  });
};

export const deletePost = (id) => {
  return prisma.post.delete({
    where: { id },
  });
};
