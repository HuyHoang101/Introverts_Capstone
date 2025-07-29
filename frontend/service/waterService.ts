import request from '../lib/waterApi';

export const getAllWaterData = async () => {
  return request('/', { method: 'GET' });
};

export const getWaterById = async (id: string) => {
  return request(`/${id}`, { method: 'GET' });
};

export const addWaterData = async (data: any) => {
  return request('/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateWaterData = async (id: string, data: any) => {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteWaterData = async (id: string) => {
  return request(`/${id}`, { method: 'DELETE' });
};
