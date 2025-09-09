import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SlotId } from '../constants/slots';
import { slotDateRange, toYMD } from '@/utils/time';
import { getAllBookings } from '@/service/bookingTableService';
import { getAllTables } from '@/service/tableService';

type Props = {
  selectedDeskId: string | null;
  onSelect: (deskId: string) => void;
  dateYMD: string;
  slotId: SlotId;
  refreshKey?: number;
  userId: string; // 👈 thêm userId của bạn
};

export default function DeskGrid({
  selectedDeskId,
  onSelect,
  dateYMD,
  slotId,
  refreshKey = 0,
  userId
}: Props) {
  const [bookingsForDate, setBookingsForDate] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);

  const now = new Date();
  const todayYMD = toYMD(now);
  const { start, end } = slotDateRange(dateYMD, slotId);
  const isCurrentSlotNow = todayYMD === dateYMD && now >= start && now <= end;

  // fetch danh sách bàn
  useEffect(() => {
    (async () => {
      try {
        const allTables = await getAllTables();
        const sortedTables = (allTables ?? []).sort(
          (a: { name: string }, b: { name: string }) => {
            const numA = parseInt(a.name.replace(/\D/g, ''), 10) || 0;
            const numB = parseInt(b.name.replace(/\D/g, ''), 10) || 0;
            return numA - numB;
          }
        );
        setTables(sortedTables);
      } catch (e) {
        setTables([]);
      }
    })();
  }, [refreshKey]);

  // fetch bookings
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const all = await getAllBookings();
        if (!mounted) return;
        const relevant = (all || []).filter((b: any) => {
          const bDate = b.dateYMD ?? b.startTime?.slice(0, 10);
          if (bDate !== dateYMD) return false;
          if (typeof b.slotId !== 'undefined') {
            return b.slotId === slotId;
          }
          const bs = new Date(b.startTime).getTime();
          const be = new Date(b.endTime).getTime();
          return start.getTime() < be && end.getTime() > bs;
        });
        setBookingsForDate(relevant);
      } catch (e) {
        setBookingsForDate([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dateYMD, slotId, refreshKey]);

  // ✅ fix logic: phân biệt booking của bạn hay người khác
  const statusOfDesk = (deskId: string): 'free' | 'mine_now' | 'mine_future' | 'other' => {
  const b = bookingsForDate.find(x => String(x.tableId) === String(deskId));
  if (!b) return 'free';

  if (b.userId === userId) {
    if (isCurrentSlotNow) return 'mine_now';   // mình, slot hiện tại
    return 'mine_future';                      // mình, slot tương lai
  } else {
    return 'other';                            // người khác
  }

};


  const cellStyle = (
  state: 'free' | 'mine_now' | 'mine_future' | 'other',
  selected: boolean
) => ({
  backgroundColor:
    state === 'mine_now'
      ? '#fed7aa' // cam: bạn, slot hiện tại
      : state === 'mine_future'
      ? '#fde68a' // vàng nhạt: bạn, slot tương lai
      : state === 'other'
      ? '#fecaca' // đỏ nhạt: người khác
      : '#c8f7c5', // xanh: trống
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
        {tables.map(t => {
          const selected = t.id === selectedDeskId;
          const state = statusOfDesk(t.id);
          return (
            <Pressable
              key={t.id}
              onPress={() => onSelect(t.id)}
              style={cellStyle(state, selected)}
            >
              <Text style={styles.cellText}>{t.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  cellText: { fontSize: 16, fontWeight: '700', color: '#000' }
});
