import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import { SLOTS, SlotId } from '@/constants/slots';

dayjs.extend(relativeTime);
dayjs.locale('en');

/**
 * Format timestamp (Firebase or JS Date) to "dd/mm/yyyy hh:mm"
 */
export const formatVietnamTime = (timestamp: any): string => {
  const date = timestamp?._seconds
    ? dayjs.unix(timestamp._seconds)
    : dayjs(timestamp);

  return date.format('DD MMM YYYY - HH:mm');
};

/**
 * Format timestamp (Firebase or JS Date) to "dd/mm/yyyy hh:mm"
 */
export const formatMonthYear = (timestamp: any): string => {
  const date = timestamp?._seconds
    ? dayjs.unix(timestamp._seconds)
    : dayjs(timestamp);

  return date.format('MMM YYYY');
};

/**
 * Format timestamp (Firebase or JS Date) to "dd/mm/yyyy hh:mm"
 */
export const formatHourDate = (timestamp: any): string => {
  const date = timestamp?._seconds
    ? dayjs.unix(timestamp._seconds)
    : dayjs(timestamp);

  return date.format('DD/MM  HH:mm');
};

/**
 * Format timestamp (Firebase or JS Date) to "dd/mm/yyyy hh:mm"
 */
export const formatDate = (timestamp: any): string => {
  const date = timestamp?._seconds
    ? dayjs.unix(timestamp._seconds)
    : dayjs(timestamp);

  return date.format('DD/MM');
};

export const formatDateYear = (timestamp: any): string => {
  const date = timestamp?._seconds
    ? dayjs.unix(timestamp._seconds)
    : dayjs(timestamp);

  return date.format('DD/MM/YYYY');
};


/**
 * Show relative time like "3 hours ago"
 */
export const timeAgo = (timestamp: any): string => {
  const date = timestamp?._seconds
    ? dayjs.unix(timestamp._seconds)
    : dayjs(timestamp);

  return date.fromNow();
};

export type YMD = string; // 'YYYY-MM-DD'

export const toYMD = (d: Date): YMD => {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const addDays = (d: Date, days: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
};

// Lấy Date start/end của 1 slot trong 1 ngày (múi giờ local của máy)
export const slotDateRange = (dateYMD: YMD, slotId: SlotId) => {
  const slot = SLOTS.find(s => s.id === slotId)!;
  const [y, m, d] = dateYMD.split('-').map(Number);
  const start = new Date(y, m - 1, d, slot.startHour, 0, 0);
  const end   = new Date(y, m - 1, d, slot.endHour, 0, 0);
  return { start, end };
};

// Kiểm tra “quyền check-in”: từ lúc slot bắt đầu đến 15 phút sau
export const canCheckInNow = (dateYMD: YMD, slotId: SlotId, now = new Date()) => {
  const { start } = slotDateRange(dateYMD, slotId);
  const deadline = new Date(start.getTime() + 15 * 60 * 1000);
  return now >= start && now <= deadline;
};

// Slot đã quá hạn check-in chưa?
export const isCheckInExpired = (dateYMD: YMD, slotId: SlotId, now = new Date()) => {
  const { start } = slotDateRange(dateYMD, slotId);
  const deadline = new Date(start.getTime() + 15 * 60 * 1000);
  return now > deadline;
};

// Slot đã kết thúc chưa?
export const isSlotEnded = (dateYMD: YMD, slotId: SlotId, now = new Date()) => {
  const { end } = slotDateRange(dateYMD, slotId);
  return now > end;
};

export function checkInDeadline(dateYMD: string, slotId: SlotId) {
  const { start } = slotDateRange(dateYMD, slotId);
  return new Date(start.getTime() + 15 * 60 * 1000);
}

export function secondsUntil(when: Date, now = new Date()) {
  return Math.max(0, Math.floor((when.getTime() - now.getTime()) / 1000));
}

export function fmtMMSS(sec: number) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}
