// controller/bookingTable.controller.js
import * as bookingService from '../service/bookingTable.service.js';

export const createBooking = async (req, res) => {
  try {
    const { tableId, userId, slotId, dateYMD, startTime, endTime } = req.body;

    const booking = await bookingService.createBooking({
      tableId,
      userId,
      slotId,
      dateYMD,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Create booking error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    await bookingService.deleteBooking(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBookingsByTable = async (req, res) => {
  try {
    const bookings = await bookingService.getBookingsByTable(req.params.tableId);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
