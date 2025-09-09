// SlotSingle.tsx
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import type { SlotId } from '../constants/slots';
import { getUserInfo } from '@/service/authService';
import {
  getBookingsByTable,
  createBooking,
  deleteBooking,
  isTableAvailable,
} from '@/service/bookingTableService';
import {
  isSlotEnded,
  slotDateRange,
} from '@/utils/time';

type Props = {
  deskId: string;
  dateYMD: string;
  slotId: SlotId;
  label: string;
  quotaUsed?: boolean;
  onRefresh?: () => void;
  userId?: string; // 👈 thêm userId của bạn
};

export default function SlotSingle({
  deskId,
  dateYMD,
  slotId,
  label,
  quotaUsed = false,
  onRefresh,
}: Props) {
  const [user, setUser] = useState<any>(null);
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const now = new Date();

  // load user
  useEffect(() => {
    (async () => {
      try {
        const u = await getUserInfo();
        setUser(u);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  const fetchBooking = async () => {
    if (!deskId || !dateYMD) return;
    setLoading(true);
    try {
      const all = await getBookingsByTable(String(deskId));
      const found = (all || []).find(
        (b: any) => b.dateYMD === dateYMD && b.slotId === slotId,
      );
      setBooking(found ?? null);
    } catch {
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [deskId, dateYMD, slotId]);

  const ended = isSlotEnded(dateYMD, slotId, now);
  const myBooking = booking && user && booking.userId === user.id;
  const otherBooking = booking && !myBooking;

  const show = (
    type: 'success' | 'error' | 'info',
    text1: string,
    text2?: string,
    long = false,
  ) =>
    Toast.show({
      type,
      text1,
      text2,
      topOffset: 70,
      visibilityTime: long ? 7000 : 4500,
    });

  const Btn = ({
    title,
    onPress,
    disabled,
  }: {
    title: string;
    onPress: () => void;
    disabled?: boolean;
  }) => (
    <Pressable
      style={[styles.btn, disabled && styles.btnDisabled]}
      onPress={onPress}
      disabled={!!disabled}
    >
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );

  // Book
  const handleBook = async () => {
    if (!user) {
      show('error', 'Login required', 'Please login to book.');
      return;
    }
    if (quotaUsed) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      show('error', 'Booking blocked', "You've used today's booking quota (1 slot/day).");
      return;
    }

    try {
      setActing(true);
      const { start, end } = slotDateRange(dateYMD, slotId);

      const avail = await isTableAvailable(
        String(deskId),
        start.toISOString(),
        end.toISOString(),
      );
      if (!avail) {
        show('error', 'Cannot book', 'This table is already booked.');
        return;
      }

      const newBooking = await createBooking({
        tableId: String(deskId),
        userId: user.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        dateYMD,
        slotId,
      });

      setBooking(newBooking);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      show(
        'success',
        'Booked successfully',
        'You have used today’s quota.',
        true,
      );
      onRefresh?.();
    } catch (e: any) {
      show('error', 'Cannot book', e?.message ?? '');
    } finally {
      setActing(false);
    }
  };

  // Cancel
  const handleCancel = async () => {
    if (!booking) return;
    try {
      setActing(true);
      await deleteBooking(booking.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      show('info', 'Cancelled', 'Slot cancelled. Your daily booking quota is restored.', true);
      setBooking(null);
      onRefresh?.();
    } catch (e: any) {
      show('error', 'Cancel failed', e?.message ?? '');
    } finally {
      setActing(false);
    }
  };

  return (
    <View
      style={[
        styles.row,
        myBookingStyle(myBooking),
        otherBookingStyle(otherBooking && !myBooking),
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.slotTitle}>{label}</Text>

        {loading ? (
          <Text style={styles.statusText}>Loading…</Text>
        ) : (
          <Text style={styles.statusText}>
            {!booking && !ended && (quotaUsed ? 'Free (quota used today)' : 'Free')}
            {otherBooking && 'Booked (by another user)'}
            {myBooking && 'You booked'}
            {ended && 'Ended'}
          </Text>
        )}
      </View>

      {loading && <ActivityIndicator />}

      {/* Free -> Book */}
      {!loading && !booking && !ended && (
        <Btn
          title={acting ? 'Booking…' : 'Book'}
          onPress={handleBook}
          disabled={acting || quotaUsed}
        />
      )}

      {/* My booking -> Cancel */}
      {!loading && myBooking && (
        <Pressable style={styles.btnGhost} onPress={handleCancel} disabled={acting}>
          <Text style={styles.btnGhostText}>{acting ? 'Cancelling…' : 'Cancel'}</Text>
        </Pressable>
      )}
    </View>
  );
}

function myBookingStyle(isMine?: boolean) {
  return isMine ? { backgroundColor: '#fed7aa' } : {};
}
function otherBookingStyle(isOther?: boolean) {
  return isOther ? { backgroundColor: '#fecaca' } : {};
}

const styles = StyleSheet.create({
  row: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#f6f6f6',
  },
  slotTitle: { fontSize: 17, fontWeight: '800', color: '#000' },
  statusText: { color: '#333', marginTop: 2, fontSize: 13 },
  btn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: 'white', fontWeight: '800', fontSize: 15 },
  btnGhost: {
    borderWidth: 1,
    borderColor: '#999',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  btnGhostText: { color: '#333', fontWeight: '700' },
});
