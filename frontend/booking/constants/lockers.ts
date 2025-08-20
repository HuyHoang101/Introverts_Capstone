export type LockerItem = {
  id: string;
  name: string;
  quantity: number;
  weight: string;
  overview: string;
  usage: string;
  purpose: string;
  history: string;
};

export const LOCKER_NUMS = [5, 4, 3, 2, 1];

export const LOCKER_CONTENTS: Record<number, LockerItem[]> = {
  // … dán nguyên file chi tiết mình đã gửi (5A/B/C … 1A/B/C)
};
