import request from '../lib/roomApi';

// Get all rooms
export const getAllRooms = async () => {
  return request('/', { method: 'GET' });
};

// Get a room by ID
export const getRoomById = async (id: string) => {
  return request(`/${id}`, { method: 'GET' });
};

// Create a new room
export const createRoom = async (data: any) => {
  return request('/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Update a room
export const updateRoom = async (id: string, data: any) => {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Delete a room
export const deleteRoom = async (id: string) => {
  return request(`/${id}`, { method: 'DELETE' });
};
