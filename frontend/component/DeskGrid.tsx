// DeskGrid.tsx
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SlotId } from '../constants/slots';
import { DESKS } from '../constants/slots';
import { isCheckInExpired, slotDateRange, toYMD } from '@/utils/time';
import { getAllBookings } from '@/service/bookingTableService';

type Props = {
  selectedDeskId: number | null;
  onSelect: (deskId: number) => void;
  dateYMD: string;
  slotId: SlotId;
  refreshKey?: number;
};

export default function DeskGrid({ selectedDeskId, onSelect, dateYMD, slotId, refreshKey = 0 }: Props) {
  const [bookingsForDate, setBookingsForDate] = useState<any[]>([]);
  const now = new Date();
  const todayYMD = toYMD(now);
  const { start, end } = slotDateRange(dateYMD, slotId);
  const isCurrentSlotNow = todayYMD === dateYMD && now >= start && now <= end;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const all = await getAllBookings();
        if (!mounted) return;
        // filter to bookings that fall on the date and overlap this slot (start/end equality used in other places)
        const relevant = (all || []).filter((b: any) => {
          // b.startTime and b.endTime are ISO strings — compare date portion / exact times
          const bDate = b.dateYMD ?? b.startTime?.slice(0,10);
          if (bDate !== dateYMD) return false;
          // we also care about slotId equality if backend stored it
          if (typeof b.slotId !== 'undefined') {
            return b.slotId === slotId;
          }
          // fallback: check time overlap
          const bs = new Date(b.startTime).getTime();
          const be = new Date(b.endTime).getTime();
          return (start.getTime() < be) && (end.getTime() > bs);
        });
        setBookingsForDate(relevant);
      } catch (e) {
        setBookingsForDate([]);
      }
    })();
    return () => { mounted = false; };
  }, [dateYMD, slotId, refreshKey]);

  const statusOfDesk = (deskId: number): 'free'|'booked'|'in_use' => {
    const b = bookingsForDate.find(x => String(x.tableId) === String(deskId) || Number(x.tableId) === deskId);
    if (!b) return 'free';
    if (b.status === 'checked_in' && isCurrentSlotNow) return 'in_use';
    if (b.status === 'booked' && !isCheckInExpired(dateYMD, slotId, now)) return 'booked';
    return 'free';
  };

  const cellStyle = (state: 'free'|'booked'|'in_use', selected: boolean) => ({
    backgroundColor:
      state === 'in_use' ? '#fff1a6' : // yellow
      state === 'booked' ? '#ffb3b3' : // red
      '#c8f7c5',                       // green
    borderWidth: selected ? 2 : 0,
    borderColor: selected ? '#2563eb' : 'transparent',
    width: '45%' as const,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 12
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {DESKS.map(d => {
          const selected = d.id === selectedDeskId;
          const state = statusOfDesk(d.id);
          return (
            <Pressable
              key={d.id}
              onPress={() => onSelect(d.id)}
              style={cellStyle(state, selected)}
            >
              <Text style={styles.cellText} >Table {d.id}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cellText: { fontSize: 16, fontWeight: '700', color: '#000'},
});
