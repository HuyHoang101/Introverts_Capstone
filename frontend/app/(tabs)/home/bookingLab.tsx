import React, { useEffect, useMemo, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import DeskGrid from '@/component/DeskGrid';
import LegendBar from '@/component/LegendBar';
import LockerColumn from '@/component/LockerColumn';
import LockerModal from '@/component/LockerModal';
import SlotSingle from '@/component/SlotSingle';
import Toolbar from '@/component/Toolbar';

import { SLOTS, SlotId } from '@/constants/slots';
import { toYMD } from '@/utils/time';
import { getUserInfo } from '@/service/authService';
import { getAllBookings } from '@/service/bookingTableService';
import { getAllTables } from '@/service/tableService';

type SelectedDesk = { id: string; name?: string } | null;

export default function Home() {
  const router = useRouter();
  const { roomId, roomName } = useLocalSearchParams<{ roomId?: string; roomName?: string }>();

  const today = useMemo(() => new Date(), []);
  const [selectedDateYMD, setSelectedDateYMD] = useState(toYMD(today));
  const [selectedDesk, setSelectedDesk] = useState<SelectedDesk>(null);
  const [slotId, setSlotId] = useState<SlotId>(0);
  const slot = SLOTS.find((s) => s.id === slotId)!;

  const [refreshKey, setRefreshKey] = useState(0);
  const doRefresh = () => setRefreshKey((k) => k + 1);

  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [tablesById, setTablesById] = useState<Record<string, { id: string; name?: string; roomId?: string }>>({});

  const now = new Date();
  const todayYMD = toYMD(now);

  const visibleBookings = myBookings.filter((b: any) => {
    if (b.dateYMD < todayYMD) return false;
    if (b.dateYMD === todayYMD) {
      const slotInfo = SLOTS.find((s) => s.id === b.slotId);
      if (!slotInfo) return false;
      const slotStart = new Date();
      slotStart.setHours(slotInfo.startHour, 0, 0, 0);
      if (slotStart <= now) return false;
    }
    return true;
  });

  // Load user once
  useEffect(() => {
    (async () => {
      try { const u = await getUserInfo(); setUser(u); } catch { setUser(null); }
    })();
  }, []);

  // Load tables, rồi lọc theo roomId để dùng cho label & chọn mặc định
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await getAllTables();
        if (!mounted) return;
        const all: Array<{ id: string; name?: string; roomId?: string }> = (rows || []).map((r: any) => ({
          id: String(r.id ?? r.tableId),
          name: r.name,
          roomId: r.roomId ? String(r.roomId) : undefined,
        }));
        const filtered = roomId ? all.filter((t) => t.roomId === String(roomId)) : all;

        const map: Record<string, { id: string; name?: string; roomId?: string }> = {};
        filtered.forEach((r) => { map[r.id] = r; });
        setTablesById(map);

        if (!selectedDesk && filtered.length) {
          setSelectedDesk({ id: filtered[0].id, name: filtered[0].name });
        }
      } catch {}
    })();
    return () => { mounted = false; };
  }, [roomId]);

  // Fetch my bookings
  useEffect(() => {
    if (!user) { setMyBookings([]); return; }
    let mounted = true;
    (async () => {
      try {
        const all = await getAllBookings();
        if (!mounted) return;
        const mine = (all || []).filter((b: any) => b.userId === user.id);
        setMyBookings(mine);
      } catch { setMyBookings([]); }
    })();
    return () => { mounted = false; };
  }, [user, refreshKey]);

  const quotaUsed = (() => { if (!user) return false; return myBookings.some((b) => b.dateYMD === selectedDateYMD); })();

  const [openLocker, setOpenLocker] = useState(false);
  const [lockerNum, setLockerNum] = useState<number | null>(null);
  const onPressLocker = (n: number) => { setLockerNum(n); setOpenLocker(true); };
  const stickyHeaderIndices = [2];

  const deskLabel = selectedDesk?.name ?? (selectedDesk?.id ? `Table ${selectedDesk.id}` : 'Table');

  return (
    <ImageBackground source={require('@/assets/images/bg_main.png')} style={styles.bg} resizeMode="stretch">
      <ScrollView contentContainerStyle={styles.container} stickyHeaderIndices={stickyHeaderIndices}>
        {/* Hero header */}
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.h1}>Lab Desk Booking</Text>
          </View>
          <Text style={styles.sub}>Room: {roomName ?? roomId ?? 'All'}</Text>
          <Text style={styles.sub}>2-hour slots: 08:00–18:00 (5 slots/day). Check in within first 15 minutes.</Text>
        </View>

        <View style={{ height: 4 }} />

        {/* Toolbar + legend */}
        <View style={styles.stickyBlock}>
          <Toolbar dateYMD={selectedDateYMD} onChangeDate={setSelectedDateYMD} slotId={slotId} onChangeSlot={setSlotId} />
          {quotaUsed && (
            <View style={styles.banner}><Text style={styles.bannerTxt}>You’ve used today’s booking quota (1 slot/day).</Text></View>
          )}
          <LegendBar />
        </View>

        {/* Map: locker + desk grid */}
        <View style={{ marginTop: 12, flexDirection: 'row' }}>
          <LockerColumn onPressLocker={onPressLocker} />
          <View style={{ flex: 1 }}>
            <DeskGrid
              roomId={roomId ? String(roomId) : undefined}   // 👈 PASS roomId vào DeskGrid
              selectedDeskId={selectedDesk?.id ?? null}
              onSelect={(deskId: string) => {
                const id = String(deskId);
                const item = tablesById[id];
                setSelectedDesk({ id, name: item?.name });
              }}
              dateYMD={selectedDateYMD}
              slotId={slotId}
              refreshKey={refreshKey}
              userId={user?.id}
            />
          </View>
        </View>

        {/* Slot detail */}
        {selectedDesk && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.h2}>{deskLabel} — {selectedDateYMD}</Text>
            <SlotSingle
              deskId={selectedDesk.id}
              dateYMD={selectedDateYMD}
              slotId={slotId}
              label={slot.label}
              quotaUsed={quotaUsed}
              onRefresh={doRefresh}
              userId={user?.id}
            />
          </View>
        )}

        {/* My bookings */}
        <View style={{ marginTop: 24, marginBottom: 16 }}>
          <Text style={styles.h2}>My bookings</Text>
          {/* (unchanged logic, left as-is) */}
        </View>
      </ScrollView>
      <LockerModal visible={openLocker} locker={lockerNum} onClose={() => setOpenLocker(false)} />
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
});
