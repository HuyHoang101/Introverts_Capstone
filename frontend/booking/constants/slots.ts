export type SlotId = 0 | 1 | 2 | 3 | 4;

export const SLOTS: { id: SlotId; label: string; start: string; end: string }[] = [
  { id: 0, label: '08:00–10:00', start: '08:00', end: '10:00' },
  { id: 1, label: '10:00–12:00', start: '10:00', end: '12:00' },
  { id: 2, label: '12:00–14:00', start: '12:00', end: '14:00' },
  { id: 3, label: '14:00–16:00', start: '14:00', end: '16:00' },
  { id: 4, label: '16:00–18:00', start: '16:00', end: '18:00' },
];
