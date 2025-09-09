import prisma from '../config/prisma.js';
import { broadcastPostNotifications } from '../notification/notification.post.js';

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
  const post = prisma.post.create({
    data,
    include: {
      author: true,
      Comment: true,
      like: true,
    },
  });
  post.then((p) => {
    // Tạo thông báo cho tất cả user
    broadcastPostNotifications(p.id).catch((err) => {
      console.error("Failed to broadcast post notifications", err);
    });
  });
  return post;
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
