import request from '../lib/userApi';

// CRUD cơ bản
export const getAllUsers = async () => {
  return request('/', { method: 'GET' });
};

export const getUserById = async (id: string) => {
  return request(`/${id}`, { method: 'GET' });
};

export const addUser = async (data: any) => {
  return request('/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateUser = async (id: string, data: any) => {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (id: string) => {
  return request(`/${id}`, { method: 'DELETE' });
};

export const uploadUserAvatar = async (id: string, fileUri: string) => {
  const formData = new FormData();
  formData.append('avatar', {
    uri: fileUri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  } as any); // 👈 React Native cần ép kiểu

  const res = await fetch(`https://greensyncintroverts.online/api/users/${id}/upload-avatar`, {
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

export const deleteUserAvatar = async (id: string) => {
  const res = await fetch(`https://greensyncintroverts.online/api/users/${id}/delete-avatar`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Delete failed: ${err}`);
  }

  return res.json();
};
