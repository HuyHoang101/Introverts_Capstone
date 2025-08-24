import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { SlotId } from '../constants/slots';
import { isCheckInExpired, toYMD } from './time';

type Status = 'available' | 'booked' | 'checked_in';

export type Booking = {
  deskId: number;
  dateYMD: string;
  slotId: SlotId;
  status: Status;
  bookedAt: number;
  checkedInAt?: number;
  userId: string;
  notifIds?: string[];
};

type Store = {
  userId: string;
  todayYMD: string;
  bookings: Booking[];
  quotaConsumed: Record<string, boolean>;
  lastSystemCancel: { deskId: number; dateYMD: string; slotId: SlotId } | null;

  findBooking: (deskId: number, dateYMD: string, slotId: SlotId) => Booking | undefined;
  hasAnyBookingOnDate: (userId: string, dateYMD: string) => boolean;
  quotaUsedFor: (dateYMD: string) => boolean;

  book: (deskId: number, dateYMD: string, slotId: SlotId) => { ok: boolean; reason?: string };
  cancel: (deskId: number, dateYMD: string, slotId: SlotId) => void;
  checkIn: (deskId: number, dateYMD: string, slotId: SlotId) => { ok: boolean; reason?: string };

  setNotifIds: (deskId: number, dateYMD: string, slotId: SlotId, ids: string[]) => void;

  garbageCollect: (now?: Date) => void;
  clearLastSystemCancel: () => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      userId: 'demo-user-1',
      todayYMD: toYMD(new Date()),
      bookings: [],
      quotaConsumed: {},
      lastSystemCancel: null,

      findBooking: (deskId, dateYMD, slotId) =>
        get().bookings.find(b => b.deskId === deskId && b.dateYMD === dateYMD && b.slotId === slotId),

      hasAnyBookingOnDate: (userId, dateYMD) => {
        if (get().quotaConsumed[dateYMD]) return true;
        return get().bookings.some(b => b.userId === userId && b.dateYMD === dateYMD);
      },

      quotaUsedFor: (dateYMD) => !!get().quotaConsumed[dateYMD] ||
        get().bookings.some(b => b.userId === get().userId && b.dateYMD === dateYMD),

      book: (deskId, dateYMD, slotId) => {
        get().garbageCollect();
        if (get().hasAnyBookingOnDate(get().userId, dateYMD)) {
          return { ok: false, reason: "You've used today's booking quota (1 slot/day)." };
        }
        const existing = get().findBooking(deskId, dateYMD, slotId);
        if (existing) return { ok: false, reason: 'This slot is not available.' };

        const newBooking: Booking = {
          deskId, dateYMD, slotId,
          status: 'booked',
          bookedAt: Date.now(),
          userId: get().userId,
        };
        set({
          bookings: [...get().bookings, newBooking],
          quotaConsumed: { ...get().quotaConsumed, [dateYMD]: true },
        });
        return { ok: true };
      },

      cancel: (deskId, dateYMD, slotId) => {
        const after = get().bookings.filter(b => !(b.deskId === deskId && b.dateYMD === dateYMD && b.slotId === slotId));
        const stillHas = after.some(b => b.userId === get().userId && b.dateYMD === dateYMD);
        set({
          bookings: after,
          quotaConsumed: { ...get().quotaConsumed, [dateYMD]: stillHas ? true : false },
        });
      },

      checkIn: (deskId, dateYMD, slotId) => {
        const b = get().findBooking(deskId, dateYMD, slotId);
        if (!b) return { ok: false, reason: 'No booking found.' };
        if (b.userId !== get().userId) return { ok: false, reason: 'Not your booking.' };
        if (b.status === 'checked_in') return { ok: false, reason: 'Already checked in.' };

        const updated: Booking = { ...b, status: 'checked_in', checkedInAt: Date.now() };
        set({ bookings: get().bookings.map(x => (x === b ? updated : x)) });
        return { ok: true };
      },

      setNotifIds: (deskId, dateYMD, slotId, ids) => {
        const b = get().findBooking(deskId, dateYMD, slotId);
        if (!b) return;
        const updated: Booking = { ...b, notifIds: ids };
        set({ bookings: get().bookings.map(x => (x === b ? updated : x)) });
      },

      garbageCollect: (now = new Date()) => {
        let systemCancel: Store['lastSystemCancel'] = null;
        const kept = get().bookings.filter(b => {
          if (b.status !== 'booked') return true;
          const expired = isCheckInExpired(b.dateYMD, b.slotId, now);
          if (!expired) return true;
          if (b.userId === get().userId) {
            systemCancel = { deskId: b.deskId, dateYMD: b.dateYMD, slotId: b.slotId };
            set({ quotaConsumed: { ...get().quotaConsumed, [b.dateYMD]: true } });
          }
          return false;
        });
        if (kept.length !== get().bookings.length) set({ bookings: kept, lastSystemCancel: systemCancel });
      },

      clearLastSystemCancel: () => set({ lastSystemCancel: null }),
    }),
    {
      name: 'lab-booking',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ bookings: s.bookings, quotaConsumed: s.quotaConsumed, userId: s.userId }),
    }
  )
);
