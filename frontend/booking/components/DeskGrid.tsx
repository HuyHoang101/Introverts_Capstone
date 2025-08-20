import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useStore } from '../lib/store';
import type { SlotId } from '../constants/slots';

const ALL_DESKS = [1,2,3,4,5,6,7,8];

export default function DeskGrid({
  selectedDeskId, onSelect, dateYMD, slotId,
}: { selectedDeskId: number|null; onSelect: (id:number)=>void; dateYMD:string; slotId:SlotId }) {

  const { bookings } = useStore();

  const statusOf = (deskId: number) => {
    const b = bookings.find(x => x.deskId===deskId && x.dateYMD===dateYMD && x.slotId===slotId);
    if (!b) return 'free';
    return b.status === 'checked_in' ? 'using' : 'booked';
  };

  return (
    <View style={styles.grid}>
      {ALL_DESKS.map(id => {
        const st = statusOf(id);
        const bg =
          st === 'free' ? '#dff9e2' :
          st === 'using' ? '#ffefb0' : '#ffd0d0';
        const sel = id === selectedDeskId;
        return (
          <Pressable key={id} onPress={() => onSelect(id)} style={[styles.cell, { backgroundColor: bg, borderColor: sel ? '#2563eb' : '#e5e7eb', borderWidth: sel?2:1 }]}>
            <Text style={styles.cellText}>Table {id}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection:'row', flexWrap:'wrap', gap:14 },
  cell: { width:'48%', height:90, borderRadius:16, alignItems:'center', justifyContent:'center' },
  cellText: { fontWeight:'800', fontSize:16 },
});
