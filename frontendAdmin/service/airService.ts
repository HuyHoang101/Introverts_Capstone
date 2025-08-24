import request from '../lib/airApi';

export const getAllAirData = async () => {
  return request('/', { method: 'GET' });
};

export const getAirById = async (id: string) => {
  return request(`/${id}`, { method: 'GET' });
};

export const addAirData = async (data: any) => {
  return request('/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateAirData = async (id: string, data: any) => {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteAirData = async (id: string) => {
  return request(`/${id}`, { method: 'DELETE' });
};
