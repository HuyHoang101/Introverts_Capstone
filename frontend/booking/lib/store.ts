import { create } from 'zustand';
import type { SlotId } from '../constants/slots';

type Status = 'booked' | 'checked_in';

export type Booking = {
  deskId: number;
  dateYMD: string;
  slotId: SlotId;
  status: Status;
  bookedAt: number;
  checkedInAt?: number;
  userId: string;
};

type Store = {
  userId: string;
  bookings: Booking[];
  lastSystemCancel?: { deskId: number; dateYMD: string; slotId: SlotId } | null;

  findBooking: (deskId: number, dateYMD: string, slotId: SlotId) => Booking | undefined;
  hasAnyBookingOnDate: (userId: string, dateYMD: string) => boolean;

  book: (deskId: number, dateYMD: string, slotId: SlotId) => { ok: boolean; reason?: string };
  cancel: (deskId: number, dateYMD: string, slotId: SlotId) => void;
  checkIn: (deskId: number, dateYMD: string, slotId: SlotId) => { ok: boolean; reason?: string };

  garbageCollect: () => void;
  clearLastSystemCancel: () => void;
};

export const useStore = create<Store>((set, get) => ({
  userId: 'demo-user-1',
  bookings: [],
  lastSystemCancel: null,

  findBooking: (deskId, dateYMD, slotId) =>
    get().bookings.find((b) => b.deskId === deskId && b.dateYMD === dateYMD && b.slotId === slotId),

  hasAnyBookingOnDate: (userId, dateYMD) =>
    get().bookings.some((b) => b.userId === userId && b.dateYMD === dateYMD),

  book: (deskId, dateYMD, slotId) => {
    if (get().hasAnyBookingOnDate(get().userId, dateYMD)) {
      return { ok: false, reason: 'You already booked a slot today.' };
    }
    if (get().findBooking(deskId, dateYMD, slotId)) {
      return { ok: false, reason: 'Slot unavailable.' };
    }
    const now = Date.now();
    const newBooking: Booking = {
      deskId,
      dateYMD,
      slotId,
      status: 'booked',          // literal được giữ đúng kiểu Status
      bookedAt: now,
      userId: get().userId,
    };
    set((state) => ({ bookings: [...state.bookings, newBooking] }));
    return { ok: true };
  },

  cancel: (deskId, dateYMD, slotId) => {
    set((state) => ({
      bookings: state.bookings.filter(
        (b) => !(b.deskId === deskId && b.dateYMD === dateYMD && b.slotId === slotId),
      ),
    }));
  },

  checkIn: (deskId, dateYMD, slotId) => {
    const b = get().findBooking(deskId, dateYMD, slotId);
    if (!b) return { ok: false, reason: 'Not found.' };
    if (b.status === 'checked_in') return { ok: false, reason: 'Already checked-in.' };

    const updated: Booking = {
      ...b,
      status: 'checked_in',      // ép về union Status thay vì string
      checkedInAt: Date.now(),
    };
    set((state) => ({
      bookings: state.bookings.map((x) => (x === b ? updated : x)),
    }));
    return { ok: true };
  },

  garbageCollect: () => {
    // demo local: chưa xóa cứng; có thể bổ sung sau
  },

  clearLastSystemCancel: () => set({ lastSystemCancel: null }),
}));
