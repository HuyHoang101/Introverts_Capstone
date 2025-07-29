// routes/bookingTable.route.js
import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByTable
} from '../controller/bookingTable.controller.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.get('/table/:tableId', getBookingsByTable); // Lấy lịch đặt theo tableId

export default router;
