// Home.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import DeskGrid from '@/component/DeskGrid';
import LegendBar from '@/component/LegendBar';
import LockerColumn from '@/component/LockerColumn';
import LockerModal from '@/component/LockerModal';
import SlotSingle from '@/component/SlotSingle';
import Toolbar from '@/component/Toolbar';

import { SLOTS, SlotId } from '@/constants/slots';
import { toYMD } from '@/utils/time';
import { MaterialIcons } from '@expo/vector-icons';
import { getUserInfo } from '@/service/authService';
import { getAllBookings } from '@/service/bookingTableService';
import { getAllTables } from '@/service/tableService'; // 👈 NEW

type SelectedDesk = { id: string; name?: string } | null;

export default function Home() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [selectedDateYMD, setSelectedDateYMD] = useState(toYMD(today));

  // 👇 đổi từ string | null → object { id, name }
  const [selectedDesk, setSelectedDesk] = useState<SelectedDesk>(null);

  const [slotId, setSlotId] = useState<SlotId>(0);
  const slot = SLOTS.find((s) => s.id === slotId)!;

  // refreshKey để buộc các component con refetch khi thay đổi booking
  const [refreshKey, setRefreshKey] = useState(0);
  const doRefresh = () => setRefreshKey((k) => k + 1);

  // My bookings (fetched from backend)
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // 👇 map bảng bàn: { [id]: { id, name } }
  const [tablesById, setTablesById] = useState<Record<string, { id: string; name?: string }>>({});

  const now = new Date();
  const todayYMD = toYMD(now);

  const visibleBookings = myBookings.filter((b: any) => {
    // So sánh ngày
    if (b.dateYMD < todayYMD) return false;

    // Nếu là hôm nay thì check thêm slot
    if (b.dateYMD === todayYMD) {
      const slotInfo = SLOTS.find((s) => s.id === b.slotId);
      if (!slotInfo) return false;

      // ví dụ slotInfo.startHour = 8
      const slotStart = new Date();
      slotStart.setHours(slotInfo.startHour, 0, 0, 0);

      // Nếu slot đã bắt đầu (trước thời gian hiện tại) thì ẩn
      if (slotStart <= now) return false;
    }

    return true;
  });

  // ========== Load user ==========
  useEffect(() => {
    (async () => {
      try {
        const u = await getUserInfo();
        setUser(u);
      } catch (e) {
        setUser(null);
      }
    })();
  }, []);

  // ========== Load tables (name bàn) 1 lần ==========
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await getAllTables(); // expected: [{ id, name }, ...] hoặc { tableId, name }
        if (!mounted) return;

        const map: Record<string, { id: string; name?: string }> = {};
        (rows || []).forEach((r: any) => {
          const id = String(r.id ?? r.tableId);
          map[id] = { id, name: r.name };
        });
        setTablesById(map);

        // Nếu chưa chọn bàn, set mặc định bàn đầu tiên
        if (!selectedDesk && rows?.length) {
          const firstId = String(rows[0].id ?? rows[0].tableId);
          setSelectedDesk({ id: firstId, name: rows[0].name });
        }
      } catch (e) {
        // có thể log hoặc Toast nếu muốn
      }
    })();
    return () => {
      mounted = false;
    };
  }, []); // chỉ load 1 lần

  // ========== Fetch my bookings ==========
  useEffect(() => {
    if (!user) {
      setMyBookings([]);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const all = await getAllBookings();
        if (!mounted) return;
        const mine = (all || []).filter((b: any) => b.userId === user.id);
        setMyBookings(mine);
      } catch (e) {
        setMyBookings([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user, refreshKey]);

  // quota: whether user already has booking on selectedDateYMD
  const quotaUsed = (() => {
    if (!user) return false;
    return myBookings.some((b) => b.dateYMD === selectedDateYMD);
  })();

  // Locker modal state
  const [openLocker, setOpenLocker] = useState(false);
  const [lockerNum, setLockerNum] = useState<number | null>(null);
  const onPressLocker = (n: number) => {
    setLockerNum(n);
    setOpenLocker(true);
  };

  // sticky header indices
  const stickyHeaderIndices = [2];

  // 👇 label hiển thị tên bàn (fallback sang "Table {id}" nếu chưa có name)
  const deskLabel =
    selectedDesk?.name ?? (selectedDesk?.id ? `Table ${selectedDesk.id}` : 'Table');

  return (
    <ImageBackground
      source={require('@/assets/images/bg_main.png')}
      style={styles.bg}
      resizeMode="stretch"
    >
      <ScrollView contentContainerStyle={styles.container} stickyHeaderIndices={stickyHeaderIndices}>
        {/* Hero header */}
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

        {/* Toolbar + legend */}
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

        {/* Map: locker + desk grid */}
        <View style={{ marginTop: 12, flexDirection: 'row' }}>
          <LockerColumn onPressLocker={onPressLocker} />
          <View style={{ flex: 1 }}>
            <DeskGrid
              selectedDeskId={selectedDesk?.id ?? null}
              // 👇 mỗi lần chọn bàn, set luôn cả name dựa vào tablesById
              onSelect={(deskId: string) => {
                const id = String(deskId);
                setSelectedDesk({ id, name: tablesById[id]?.name });
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
            <Text style={styles.h2}>
              {deskLabel} — {selectedDateYMD}
            </Text>

            <SlotSingle
              deskId={selectedDesk.id} // dùng id thật để gọi API
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
          {visibleBookings.length === 0 ? (
            <Text style={{ color: '#FFF' }}>No upcoming bookings.</Text>
          ) : (
            <View style={{ gap: 8 }}>
              {visibleBookings.map((b: any, i: number) => {
                const id = String(b.tableId);
                const nameFromTables = tablesById[id]?.name;
                const displayName = nameFromTables ?? b.table?.name ?? `Table ${id}`;
                return (
                  <Pressable
                    key={`${b.dateYMD}-${b.tableId}-${b.startTime}-${i}`}
                    onPress={() => {
                      setSelectedDateYMD(b.dateYMD);
                      setSelectedDesk({ id, name: nameFromTables ?? b.table?.name });
                      setSlotId(b.slotId);
                    }}
                    style={styles.myRow}
                  >
                    <Text style={styles.myTitle}>
                      {displayName} • Day {b.dateYMD}
                    </Text>
                    <Text style={styles.mySub}>
                      {SLOTS.find((s) => s.id === b.slotId)?.label}{' '}
                      • {b.status === 'checked_in' ? 'In use' : 'Booked'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

      </ScrollView>

      {/* Locker modal */}
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

  myRow: { borderWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa', padding: 12, borderRadius: 12 },
  myTitle: { fontWeight: '800', color: '#000' },
  mySub: { color: '#555', marginTop: 2 },
});
