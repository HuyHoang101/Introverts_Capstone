import request from '../lib/deviceApi';

// CRUD
export const getAllDevices = async () => {
  return request('/', { method: 'GET' });
};

export const getDeviceById = async (id: string) => {
  return request(`/${id}`, { method: 'GET' });
};

export const addDevice = async (data: any) => {
  return request('/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateDevice = async (id: string, data: any) => {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteDevice = async (id: string) => {
  return request(`/${id}`, { method: 'DELETE' });
};

// Upload image to device
export const uploadDeviceImage = async (id: string, fileUri: string) => {
  const formData = new FormData();
  formData.append('content', {
    uri: fileUri,
    name: 'device-image.jpg',
    type: 'image/jpeg',
  } as any);

  const res = await fetch(`https://greensyncintroverts.online/api/devices/${id}/upload-image`, {
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

// Delete device image
export const deleteDeviceImage = async (id: string) => {
  const res = await fetch(`https://greensyncintroverts.online/api/devices/${id}/delete-avatar`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Delete failed: ${err}`);
  }

  return res.json();
};
