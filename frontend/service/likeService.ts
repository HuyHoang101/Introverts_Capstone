import request from '../lib/likeApi';

// Get all likes
export const getAllLikes = async () => {
  return request('/', { method: 'GET' });
};

// Get like by ID
export const getLikeById = async (id: string) => {
  return request(`/${id}`, { method: 'GET' });
};

// Get likes by post ID
export const getLikesByPostId = async (postId: string) => {
  return request(`/post/${postId}`, { method: 'GET' });
};

// Create a like
export const createLike = async (data: any) => {
  return request('/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Delete a like
export const deleteLike = async (id: string) => {
  return request(`/${id}`, { method: 'DELETE' });
};
