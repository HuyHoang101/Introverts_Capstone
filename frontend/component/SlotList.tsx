import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SLOTS } from '../constants/slots';
import { useStore } from '../utils/store';
import { canCheckInNow, isCheckInExpired, isSlotEnded } from '../utils/time';

type Props = { deskId: number; dateYMD: string };

export default function SlotList({ deskId, dateYMD }: Props) {
  const { findBooking, book, cancel, checkIn, userId, garbageCollect } = useStore();
  const [_, setTick] = useState(0);

  // Tick 30s để cập nhật UI & dọn rác
  useEffect(() => {
    const t = setInterval(() => {
      garbageCollect();        // dọn các booking hết hạn
      setTick(v => v + 1);     // ép re-render
    }, 30_000);
    return () => clearInterval(t);
  }, [garbageCollect]);

  return (
    <View style={{ gap: 8 }}>
      {SLOTS.map(slot => {
        const b = findBooking(deskId, dateYMD, slot.id);
        const now = new Date();

        const ended = isSlotEnded(dateYMD, slot.id, now);
        const expired = b && b.status === 'booked' && isCheckInExpired(dateYMD, slot.id, now);
        const myBooking = b && b.userId === userId;

        let displayStatus: 'free' | 'booked_wait' | 'in_use' | 'ended' = 'free';
        if (ended) displayStatus = 'ended';
        else if (b) {
          if (b.status === 'checked_in') displayStatus = 'in_use';
          else if (!expired) displayStatus = 'booked_wait';
          else displayStatus = 'free';
        }

        const canCI = myBooking && canCheckInNow(dateYMD, slot.id, now) && b?.status === 'booked';

        return (
          <View key={slot.id} style={[styles.row, displayStyle(displayStatus)]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.slotTitle}>{slot.label}</Text>
              <Text style={styles.statusText}>
                {displayStatus === 'free'        && 'Free'}
                {displayStatus === 'booked_wait' && (myBooking ? 'You booked (check-in ≤ 15m)' : 'Booked (waiting for check-in)')}
                {displayStatus === 'in_use'      && 'In use'}
                {displayStatus === 'ended'       && 'Ended'}
              </Text>
            </View>

            {displayStatus === 'free' && !ended && (
              <Pressable
                style={styles.btn}
                onPress={() => {
                  const r = book(deskId, dateYMD, slot.id);
                  if (!r.ok) Alert.alert('Cannot book', r.reason || '');
                }}
              >
                <Text style={styles.btnText}>Book</Text>
              </Pressable>
            )}

            {displayStatus === 'booked_wait' && myBooking && (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable style={styles.btnGhost} onPress={() => cancel(deskId, dateYMD, slot.id)}>
                  <Text style={styles.btnGhostText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.btn, !canCI && styles.btnDisabled]}
                  onPress={() => {
                    if (!canCI) return;
                    const r = checkIn(deskId, dateYMD, slot.id);
                    if (!r.ok) Alert.alert('Cannot check in', r.reason || '');
                  }}
                >
                  <Text style={styles.btnText}>Check in</Text>
                </Pressable>
              </View>
            )}

            {displayStatus === 'in_use' && myBooking && (
              <Pressable style={styles.btnGhost} onPress={() => cancel(deskId, dateYMD, slot.id)}>
                <Text style={styles.btnGhostText}>End</Text>
              </Pressable>
            )}
          </View>
        );
      })}
    </View>
  );
}

const displayStyle = (s: 'free'|'booked_wait'|'in_use'|'ended') => ({
  backgroundColor:
    s === 'free' ? '#eafbe7' :
    s === 'booked_wait' ? '#fff9db' :
    s === 'in_use' ? '#e7f0ff' :
    '#efefef'
});

const styles = StyleSheet.create({
  row: { borderRadius: 12, padding: 12, alignItems: 'center', flexDirection: 'row', gap: 12 },
  slotTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  statusText: { color: '#333', marginTop: 2 },
  btn: { backgroundColor: '#2563eb', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: 'white', fontWeight: '700' },
  btnGhost: { borderWidth: 1, borderColor: '#999', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnGhostText: { color: '#333', fontWeight: '600' },
});
