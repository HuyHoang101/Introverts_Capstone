import request from '../lib/bookingTableApi';

// Get all bookings
export const getAllBookings = async () => {
  return request('/', { method: 'GET' });
};

// Get booking by ID
export const getBookingById = async (id: string) => {
  return request(`/${id}`, { method: 'GET' });
};

// Get bookings by table ID
export const getBookingsByTable = async (tableId: string) => {
  return request(`/table/${tableId}`, { method: 'GET' });
};

// Create a new booking
export const createBooking = async (data: any) => {
  return request('/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Update a booking
export const updateBooking = async (id: string, data: any) => {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Delete a booking
export const deleteBooking = async (id: string) => {
  return request(`/${id}`, { method: 'DELETE' });
};
