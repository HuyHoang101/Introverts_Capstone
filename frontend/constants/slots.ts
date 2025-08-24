export type SlotId = 0 | 1 | 2 | 3 | 4;

export const SLOTS: { id: SlotId; label: string; startHour: number; endHour: number }[] = [
  { id: 0, label: '08:00–10:00', startHour: 8, endHour: 10 },
  { id: 1, label: '10:00–12:00', startHour: 10, endHour: 12 },
  { id: 2, label: '12:00–14:00', startHour: 12, endHour: 14 },
  { id: 3, label: '14:00–16:00', startHour: 14, endHour: 16 },
  { id: 4, label: '16:00–18:00', startHour: 16, endHour: 18 },
];

export const DESKS = Array.from({ length: 8 }, (_, i) => ({ id: i + 1 }));
