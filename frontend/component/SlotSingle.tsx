import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import type { SlotId } from '../constants/slots';
import { useCountdown } from '../hooks/useCountdown';
import { cancelScheduled, scheduleBookingReminders } from '@/utils/notifications';
import { useStore } from '@/utils/store';
import { canCheckInNow, checkInDeadline, isCheckInExpired, isSlotEnded, slotDateRange } from '@/utils/time';

type Props = { deskId: number; dateYMD: string; slotId: SlotId; label: string };

export default function SlotSingle({ deskId, dateYMD, slotId, label }: Props) {
  const { findBooking, book, cancel, checkIn, userId, setNotifIds, hasAnyBookingOnDate } = useStore();
  const b = findBooking(deskId, dateYMD, slotId);
  const now = new Date();

  const ended = isSlotEnded(dateYMD, slotId, now);
  const expired = b && b.status === 'booked' && isCheckInExpired(dateYMD, slotId, now);
  const myBooking = b && b.userId === userId;
  const canCI = myBooking && canCheckInNow(dateYMD, slotId, now) && b?.status === 'booked';
  const quotaUsed = hasAnyBookingOnDate(userId, dateYMD);

  let display: 'free'|'booked_wait'|'in_use'|'ended' = 'free';
  if (ended) display = 'ended';
  else if (b) {
    if (b.status === 'checked_in') display = 'in_use';
    else if (!expired) display = 'booked_wait';
  }

  const ciDeadline = checkInDeadline(dateYMD, slotId);
  const showCountdown = myBooking && display === 'booked_wait';
  const { label: leftLabel } = useCountdown(ciDeadline);

  const show = (type: 'success'|'error'|'info', text1: string, text2: string, long = false) =>
    Toast.show({ type, text1, text2, topOffset: 70, visibilityTime: long ? 7000 : 4500 });

  const Btn = ({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) => (
    <Pressable accessibilityRole="button" accessibilityLabel={title} style={[styles.btn, disabled && styles.btnDisabled]} onPress={onPress} disabled={!!disabled}>
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );

  return (
    <View style={[styles.row]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.slotTitle}>{label}</Text>
        <Text style={styles.statusText}>
          {display === 'free'        && (quotaUsed ? 'Free (quota used today)' : 'Free')}
          {display === 'booked_wait' && (myBooking ? `You booked • Check-in left: ${leftLabel}` : 'Booked (waiting for check-in)')}
          {display === 'in_use'      && 'In use'}
          {display === 'ended'       && 'Ended'}
        </Text>
      </View>

      {display === 'free' && !ended && (
        <Btn
          title="Book"
          onPress={async () => {
            if (quotaUsed) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              show('error', 'Booking blocked', "You've used today's booking quota (1 slot/day).");
              return;
            }
            const r = book(deskId, dateYMD, slotId);
            if (!r.ok) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              show('error', 'Cannot book', r.reason || '');
              return;
            }
            const { start, end } = slotDateRange(dateYMD, slotId);
            try {
              const ids = await scheduleBookingReminders({ start, end, deskId, slotLabel: label });
              setNotifIds(deskId, dateYMD, slotId, ids);
            } catch {}
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            show('success', 'Booked successfully', 'Check in within the first 15 minutes to keep your desk. You have used today’s quota.', true);
          }}
          disabled={quotaUsed}
        />
      )}

      {display === 'booked_wait' && myBooking && (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            style={styles.btnGhost}
            onPress={async () => {
              await cancelScheduled(b?.notifIds);
              cancel(deskId, dateYMD, slotId);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              show('info', 'Cancelled', 'Slot cancelled. Your daily booking quota is restored.', true);
            }}
          >
            <Text style={styles.btnGhostText}>Cancel</Text>
          </Pressable>

          <Btn
            title="Check in"
            onPress={() => {
              const r = checkIn(deskId, dateYMD, slotId);
              if (!r.ok) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                show('error', 'Cannot check in', r.reason || '');
              } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                show('success', 'Checked in', 'Enjoy your session!');
              }
            }}
            disabled={!canCI}
          />
        </View>
      )}

      {display === 'in_use' && myBooking && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="End"
          style={styles.btnGhost}
          onPress={async () => {
            await cancelScheduled(b?.notifIds);
            cancel(deskId, dateYMD, slotId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            show('info', 'Ended', 'The slot has been ended. Your daily booking quota is restored.', true);
          }}
        >
          <Text style={styles.btnGhostText}>End</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { borderRadius: 12, padding: 14, alignItems: 'center', flexDirection: 'row', gap: 12, backgroundColor:'#f6f6f6' },
  slotTitle: { fontSize: 17, fontWeight: '800', color: '#000' },
  statusText: { color: '#333', marginTop: 2, fontSize: 13 },
  btn: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: 'white', fontWeight: '800', fontSize: 15 },
  btnGhost: { borderWidth: 1, borderColor: '#999', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
  btnGhostText: { color: '#333', fontWeight: '700' },
});
