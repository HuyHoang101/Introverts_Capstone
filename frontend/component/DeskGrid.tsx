import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SlotId } from '../constants/slots';
import { DESKS } from '../constants/slots';
import { useStore } from '@/utils/store';
import { isCheckInExpired, slotDateRange, toYMD } from '@/utils/time';

type Props = {
  selectedDeskId: number | null;
  onSelect: (deskId: number) => void;
  dateYMD: string;
  slotId: SlotId;
};

export default function DeskGrid({ selectedDeskId, onSelect, dateYMD, slotId }: Props) {
  const { findBooking } = useStore();
  const now = new Date();
  const todayYMD = toYMD(now);
  const { start, end } = slotDateRange(dateYMD, slotId);
  const isCurrentSlotNow = todayYMD === dateYMD && now >= start && now <= end;

  const statusOfDesk = (deskId: number): 'free'|'booked'|'in_use' => {
    const b = findBooking(deskId, dateYMD, slotId);
    if (!b) return 'free';
    if (b.status === 'checked_in' && isCurrentSlotNow) return 'in_use';
    // nếu chỉ booked (chưa check-in) và chưa hết hạn check-in -> coi là booked
    if (b.status === 'booked' && !isCheckInExpired(dateYMD, slotId, now)) return 'booked';
    // đã hết hạn check-in => coi là free
    return 'free';
  };

  const cellStyle = (state: 'free'|'booked'|'in_use', selected: boolean) => ({
    backgroundColor:
      state === 'in_use' ? '#fff1a6' : // yellow
      state === 'booked' ? '#ffb3b3' : // red
      '#c8f7c5',                       // green
    borderWidth: selected ? 2 : 0,
    borderColor: selected ? '#2563eb' : 'transparent'
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
              style={[styles.cell, cellStyle(state, selected)]}
            >
              <Text style={styles.cellText} >Table {d.id}</Text>
            </Pressable>
          );
        })}
      </View>
      {/* bỏ dòng “Lab – 8 tables …” & hint theo yêu cầu */}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cell: {
    width: '45%',
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: { fontSize: 16, fontWeight: '700', color: '#000'},
});
