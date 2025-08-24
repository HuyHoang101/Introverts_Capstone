import request from '../lib/tableApi';

// Get all tables
export const getAllTables = async () => {
  return request('/', { method: 'GET' });
};

// Get a table by ID
export const getTableById = async (id: string) => {
  return request(`/${id}`, { method: 'GET' });
};

// Create a new table
export const createTable = async (data: any) => {
  return request('/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Update a table
export const updateTable = async (id: string, data: any) => {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Delete a table
export const deleteTable = async (id: string) => {
  return request(`/${id}`, { method: 'DELETE' });
};
