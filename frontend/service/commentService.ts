import request from '../lib/commentApi';

// CRUD
export const getAllComments = async () => {
  return request('/', { method: 'GET' });
};

export const getCommentById = async (id: string) => {
  return request(`/${id}`, { method: 'GET' });
};

export const getCommentsByPostId = async (postId: string) => {
  return request(`/post/${postId}`, { method: 'GET' });
};

export const addComment = async (data: any) => {
  return request('/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateComment = async (id: string, data: any) => {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteComment = async (id: string) => {
  return request(`/${id}`, { method: 'DELETE' });
};

// Upload image to comment
export const uploadCommentImage = async (commentId: string, fileUri: string) => {
  const formData = new FormData();
  formData.append('commentImg', {
    uri: fileUri,
    name: 'comment-img.jpg',
    type: 'image/jpeg',
  } as any);

  const res = await fetch(`https://greensyncintroverts.online/api/comments/upload?id=${commentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed: ${err}`);
  }

  return res.json();
};

// Delete comment image
export const deleteCommentImage = async (id: string) => {
  const res = await fetch(`https://greensyncintroverts.online/api/comments/${id}/delete-avatar`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Delete failed: ${err}`);
  }

  return res.json();
};
