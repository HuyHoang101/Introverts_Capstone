import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import DeskGrid from '../../../booking/components/DeskGrid';
import LegendBar from '../../../booking/components/LegendBar';
import SlotSingle from '../../../booking/components/SlotSingle';
import Toolbar from '../../../booking/components/Toolbar';
import LockerColumn from '../../../booking/components/LockerColumn';
import LockerModal from '../../../booking/components/LockerModal';

import { SLOTS, SlotId } from '../../../booking/constants/slots';
import { useStore, type Booking } from '../../../booking/lib/store';
import { toYMD } from '../../../booking/lib/time';

export default function BookingScreen() {
  const today = useMemo(() => new Date(), []);
  const [selectedDateYMD, setSelectedDateYMD] = useState(toYMD(today));
  const [selectedDesk, setSelectedDesk] = useState<number | null>(1);
  const [slotId, setSlotId] = useState<SlotId>(0);
  const slot = SLOTS.find((s) => s.id === slotId)!;

  const { garbageCollect, lastSystemCancel, clearLastSystemCancel, bookings, userId, hasAnyBookingOnDate } = useStore();

  useEffect(() => { const t = setInterval(() => garbageCollect(), 30_000); return () => clearInterval(t); }, [garbageCollect]);
  useEffect(() => {
    if (!lastSystemCancel) return;
    Toast.show({ type: 'error', text1: 'Booking cancelled due to late check-in', text2: "You can’t book another slot today.", topOffset: 70, visibilityTime: 5000 });
    clearLastSystemCancel();
  }, [lastSystemCancel, clearLastSystemCancel]);

  const myBookings = bookings.filter((b: Booking) => b.userId === userId)
    .sort((a, b) => (a.dateYMD + a.slotId).localeCompare(b.dateYMD + b.slotId));

  const quotaUsed = hasAnyBookingOnDate(userId, selectedDateYMD);

  // locker state
  const [openLocker, setOpenLocker] = useState(false);
  const [lockerNum, setLockerNum] = useState<number | null>(null);
  const onPressLocker = (n: number) => { setLockerNum(n); setOpenLocker(true); };

  const stickyHeaderIndices: number[] = [2];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container} stickyHeaderIndices={stickyHeaderIndices}>
        <View style={styles.hero}>
          <Text style={styles.h1}>Lab Desk Booking</Text>
          <Text style={styles.sub}>2-hour slots: 08:00–18:00 (5 slots/day). Check in within first 15 minutes.</Text>
        </View>

        <View style={{ height: 4 }} />

        <View style={styles.stickyBlock}>
          <Toolbar dateYMD={selectedDateYMD} onChangeDate={setSelectedDateYMD} slotId={slotId} onChangeSlot={setSlotId} />
          {quotaUsed && (
            <View style={styles.banner}>
              <Text style={styles.bannerTxt}>You’ve used today’s booking quota (1 slot/day).</Text>
            </View>
          )}
          <LegendBar />
        </View>

        {/* Left locker + desk grid */}
        <View style={{ marginTop: 12, flexDirection: 'row' }}>
          <LockerColumn onPressLocker={onPressLocker} />
          <View style={{ flex: 1 }}>
            <DeskGrid selectedDeskId={selectedDesk} onSelect={setSelectedDesk} dateYMD={selectedDateYMD} slotId={slotId} />
          </View>
        </View>

        {selectedDesk && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.h2}>Table {selectedDesk} — {selectedDateYMD}</Text>
            <SlotSingle deskId={selectedDesk} dateYMD={selectedDateYMD} slotId={slotId} label={slot.label} />
          </View>
        )}

        <View style={{ marginTop: 24, marginBottom: 16 }}>
          <Text style={styles.h2}>My bookings</Text>
          {myBookings.length === 0 ? (
            <Text style={{ color: '#666' }}>No bookings yet.</Text>
          ) : (
            <View style={{ gap: 8 }}>
              {myBookings.map((b, i) => (
                <Pressable key={`${b.dateYMD}-${b.deskId}-${b.slotId}-${i}`} onPress={() => { setSelectedDateYMD(b.dateYMD); setSelectedDesk(b.deskId); setSlotId(b.slotId); }} style={styles.myRow}>
                  <Text style={styles.myTitle}>Table {b.deskId} • Day {b.dateYMD}</Text>
                  <Text style={styles.mySub}>
                    {SLOTS.find((s) => s.id === b.slotId)?.label} • {b.status === 'checked_in' ? 'In use' : 'Booked'}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <LockerModal visible={openLocker} locker={lockerNum} onClose={() => setOpenLocker(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10 },
  hero: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#eef2f7' },
  h1: { fontSize: 24, fontWeight: '800', letterSpacing: 0.2 },
  h2: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  sub: { fontSize: 13, color: '#555', lineHeight: 18 },
  stickyBlock: { backgroundColor: 'white', paddingTop: 10, paddingBottom: 8 },
  banner: { marginTop: 8, backgroundColor: '#fff7d6', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#f3e5a4' },
  bannerTxt: { fontWeight: '700', color: '#6b5d00' },
  myRow: { borderWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa', padding: 12, borderRadius: 12 },
  myTitle: { fontWeight: '800' },
  mySub: { color: '#555', marginTop: 2 },
});
