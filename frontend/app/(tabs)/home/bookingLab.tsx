import React, { useEffect, useMemo, useState } from 'react';
import { ImageBackground, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import DeskGrid from '@/component/DeskGrid';
import LegendBar from '@/component/LegendBar';
import LockerColumn from '@/component/LockerColumn';
import LockerModal from '@/component/LockerModal';
import SlotSingle from '@/component/SlotSingle';
import Toolbar from '@/component/Toolbar';

import { SLOTS, SlotId } from '@/constants/slots';
import type { Booking } from '@/utils/store';
import { useStore } from '@/utils/store';
import { toYMD } from '@/utils/time';
import { MaterialIcons } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [selectedDateYMD, setSelectedDateYMD] = useState(toYMD(today));
  const [selectedDesk, setSelectedDesk] = useState<number | null>(1);
  const [slotId, setSlotId] = useState<SlotId>(0);
  const slot = SLOTS.find((s) => s.id === slotId)!;

  const {
    garbageCollect,
    lastSystemCancel,
    clearLastSystemCancel,
    bookings,
    userId,
    hasAnyBookingOnDate,
  } = useStore();

  useEffect(() => {
    const t = setInterval(() => garbageCollect(), 30_000);
    return () => clearInterval(t);
  }, [garbageCollect]);

  useEffect(() => {
    if (!lastSystemCancel) return;
    Toast.show({
      type: 'error',
      text1: 'Booking cancelled due to late check-in',
      text2: "You can’t book another slot today.",
      topOffset: 70,
      visibilityTime: 5000,
    });
    clearLastSystemCancel();
  }, [lastSystemCancel, clearLastSystemCancel]);

  const myBookings = bookings
    .filter((b: Booking) => b.userId === userId)
    .sort((a: Booking, b: Booking) => (a.dateYMD + a.slotId).localeCompare(b.dateYMD + b.slotId));

  const quotaUsed = hasAnyBookingOnDate(userId, selectedDateYMD);

  // Locker modal state
  const [openLocker, setOpenLocker] = useState(false);
  const [lockerNum, setLockerNum] = useState<number | null>(null);
  const onPressLocker = (n: number) => {
    setLockerNum(n);
    setOpenLocker(true);
  };

  // sticky header: Toolbar + legend + banner
  const stickyHeaderIndices = [2];

  return (
    <ImageBackground 
      source={require('@/assets/images/bg_main.png')}
      style={styles.bg}
      resizeMode="stretch"
    >
      <ScrollView contentContainerStyle={styles.container} stickyHeaderIndices={stickyHeaderIndices}>
        {/* Hero header đơn giản */}
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.h1}>Lab Desk Booking</Text>
          </View>
          <Text style={styles.sub}>
            2-hour slots: 08:00–18:00 (5 slots/day). Check in within first 15 minutes.
          </Text>
        </View>

        <View style={{ height: 4 }} />

        {/* Sticky toolbar (ngày + giờ) + legend + banner */}
        <View style={styles.stickyBlock}>
          <Toolbar
            dateYMD={selectedDateYMD}
            onChangeDate={setSelectedDateYMD}
            slotId={slotId}
            onChangeSlot={setSlotId}
          />
          {quotaUsed && (
            <View style={styles.banner}>
              <Text style={styles.bannerTxt}>You’ve used today’s booking quota (1 slot/day).</Text>
            </View>
          )}
          <LegendBar />
        </View>

        {/* BẢN ĐỒ: cột locker bên trái + grid bàn bên phải */}
        <View style={{ marginTop: 12, flexDirection: 'row' }}>
          <LockerColumn onPressLocker={onPressLocker} />
          <View style={{ flex: 1 }}>
            <DeskGrid
              selectedDeskId={selectedDesk}
              onSelect={setSelectedDesk}
              dateYMD={selectedDateYMD}
              slotId={slotId}
            />
          </View>
        </View>

        {/* Chi tiết slot được chọn */}
        {selectedDesk && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.h2}>
              Table {selectedDesk} — {selectedDateYMD}
            </Text>
            <SlotSingle
              deskId={selectedDesk}
              dateYMD={selectedDateYMD}
              slotId={slotId}
              label={slot.label}
            />
          </View>
        )}

        {/* My bookings */}
        <View style={{ marginTop: 24, marginBottom: 16 }}>
          <Text style={styles.h2}>My bookings</Text>
          {myBookings.length === 0 ? (
            <Text style={{ color: '#FFF' }}>No bookings yet.</Text>
          ) : (
            <View style={{ gap: 8 }}>
              {myBookings.map((b: Booking, i: number) => (
                <Pressable
                  key={`${b.dateYMD}-${b.deskId}-${b.slotId}-${i}`}
                  onPress={() => {
                    setSelectedDateYMD(b.dateYMD);
                    setSelectedDesk(b.deskId);
                    setSlotId(b.slotId);
                  }}
                  style={styles.myRow}
                >
                  <Text style={styles.myTitle}>Table {b.deskId} • Day {b.dateYMD}</Text>
                  <Text style={styles.mySub}>
                    {SLOTS.find((s) => s.id === b.slotId)?.label} •{' '}
                    {b.status === 'checked_in' ? 'In use' : 'Booked'}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal locker 3 tầng A/B/C */}
      <LockerModal
        visible={openLocker}
        locker={lockerNum}
        onClose={() => setOpenLocker(false)}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, minHeight: '100%' },
  container: { padding: 16, gap: 10 },
  hero: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#eef2f7' },
  heroHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { padding: 8, borderRadius: 9999, backgroundColor: 'rgba(0,0,0,0.2)', marginRight: 16 },
  h1: { fontSize: 24, fontWeight: '800', letterSpacing: 0.2, color: '#000' },
  h2: { fontSize: 18, fontWeight: '800', marginBottom: 8, color: '#FFF' },
  sub: { fontSize: 13, color: '#555', lineHeight: 18 },

  stickyBlock: { backgroundColor: 'white', paddingTop: 10, paddingBottom: 8, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 16 },

  banner: { marginTop: 8, backgroundColor: '#fff7d6', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#f3e5a4' },
  bannerTxt: { fontWeight: '700', color: '#6b5d00' },

  myRow: { borderWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa', padding: 12, borderRadius: 12 },
  myTitle: { fontWeight: '800', color: '#000' },
  mySub: { color: '#555', marginTop: 2 },
});
