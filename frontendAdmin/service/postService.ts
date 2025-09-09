import request from '../lib/postApi';

// CRUD
export const getAllPosts = async () => {
  return request('/', { method: 'GET' });
};

export const getPostById = async (id: string) => {
  return request(`/${id}`, { method: 'GET' });
};

export const addPost = async (data: any) => {
  return request('/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updatePost = async (id: string, data: any) => {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const changePostStatus = async (id: string, published: boolean) => {
  return updatePost(id, { published: published });
};

export const deletePost = async (id: string) => {
  return request(`/${id}`, { method: 'DELETE' });
};

// Upload image to post
export const uploadPostImage = async (id: string, fileUri: string) => {
  const formData = new FormData();
  formData.append('content', {
    uri: fileUri,
    name: 'post-image.jpg',
    type: 'image/jpeg',
  } as any);

  const res = await fetch(`https://greensyncintroverts.online/api/posts/${id}/upload-image`, {
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

// Delete post image
export const deletePostImage = async (id: string) => {
  const res = await fetch(`https://greensyncintroverts.online/api/posts/${id}/delete-avatar`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Delete failed: ${err}`);
  }

  return res.json();
};
