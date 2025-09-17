import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SlotId } from '../constants/slots';
import { slotDateRange, toYMD } from '@/utils/time';
import { getAllBookings } from '@/service/bookingTableService';
import { getAllTables } from '@/service/tableService';

type Props = {
  roomId?: string;                // 👈 NEW: filter theo room
  selectedDeskId: string | null;
  onSelect: (deskId: string) => void;
  dateYMD: string;
  slotId: SlotId;
  refreshKey?: number;
  userId: string;
};

type TableRow = { id: string; name?: string; roomId?: string };

export default function DeskGrid({
  roomId,
  selectedDeskId,
  onSelect,
  dateYMD,
  slotId,
  refreshKey = 0,
  userId
}: Props) {
  const [bookingsForDate, setBookingsForDate] = useState<any[]>([]);
  const [tables, setTables] = useState<TableRow[]>([]);

  const now = new Date();
  const todayYMD = toYMD(now);
  const { start, end } = slotDateRange(dateYMD, slotId);
  const isCurrentSlotNow = todayYMD === dateYMD && now >= start && now <= end;

  // fetch danh sách bàn (lọc theo roomId)
  useEffect(() => {
    (async () => {
      try {
        const allTables = await getAllTables();
        const mapped: TableRow[] = (allTables ?? []).map((r: any) => ({
          id: String(r.id ?? r.tableId),
          name: r.name,
          roomId: r.roomId ? String(r.roomId) : undefined,
        }));
        const filtered = roomId ? mapped.filter((t) => t.roomId === String(roomId)) : mapped;

        // sort theo số trong name (Table 1, Table 2, ...)
        const sorted = filtered.sort((a, b) => {
          const numA = parseInt(String(a.name || '').replace(/\D/g, ''), 10) || 0;
          const numB = parseInt(String(b.name || '').replace(/\D/g, ''), 10) || 0;
          return numA - numB;
        });

        setTables(sorted);
      } catch (e) {
        setTables([]);
      }
    })();
  }, [roomId, refreshKey]);

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
    return () => { mounted = false; };
  }, [dateYMD, slotId, refreshKey]);

  // phân loại trạng thái cho từng bàn
  const statusOfDesk = (deskId: string): 'free' | 'mine_now' | 'mine_future' | 'other' => {
    const b = bookingsForDate.find((x) => String(x.tableId) === String(deskId));
    if (!b) return 'free';

    if (b.userId === userId) {
      if (isCurrentSlotNow) return 'mine_now';
      return 'mine_future';
    } else {
      return 'other';
    }
  };

  const cellStyle = (state: 'free' | 'mine_now' | 'mine_future' | 'other', selected: boolean) => ({
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
        {tables.map((t) => {
          const selected = t.id === selectedDeskId;
          const state = statusOfDesk(t.id);
          return (
            <Pressable key={t.id} onPress={() => onSelect(t.id)} style={cellStyle(state, selected)}>
              <Text style={styles.cellText}>{t.name ?? `Table ${t.id}`}</Text>
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
