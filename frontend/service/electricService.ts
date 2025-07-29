import request from '../lib/electricApi';

export const getAllElectricData = async () => {
  return request('/', { method: 'GET' });
};

export const getElectricById = async (id: string) => {
  return request(`/${id}`, { method: 'GET' });
};

export const addElectricData = async (data: any) => {
  return request('/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateElectricData = async (id: string, data: any) => {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteElectricData = async (id: string) => {
  return request(`/${id}`, { method: 'DELETE' });
};
