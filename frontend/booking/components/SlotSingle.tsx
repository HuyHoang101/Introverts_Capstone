import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { useStore } from '../lib/store';
import type { SlotId } from '../constants/slots';

export default function SlotSingle({
  deskId, dateYMD, slotId, label,
}: { deskId:number; dateYMD:string; slotId:SlotId; label:string; }) {
  const { findBooking, userId, book, cancel, checkIn } = useStore();
  const b = findBooking(deskId, dateYMD, slotId);
  const isMine = !!b && b.userId === userId;
  const status = b ? (b.status === 'checked_in' ? 'In use' : 'Booked') : 'Free';

  const onBook = () => {
    const res = book(deskId, dateYMD, slotId);
    if (res.ok) {
      Toast.show({ type:'success', text1:'Booked', text2:`${label} reserved. Check-in within 15 minutes.`, topOffset:70 });
    } else {
      Toast.show({ type:'error', text1:'Cannot book', text2:res.reason, topOffset:70 });
    }
  };
  const onCancel = () => {
    cancel(deskId, dateYMD, slotId);
    Toast.show({ type:'info', text1:'Cancelled', text2:'You may book again today.', topOffset:70 });
  };
  const onCheckIn = () => {
    const r = checkIn(deskId, dateYMD, slotId);
    if (r.ok) Toast.show({ type:'success', text1:'Checked in', topOffset:70 });
    else Toast.show({ type:'error', text1:'Cannot check in', text2:r.reason, topOffset:70 });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{label}</Text>
      <Text style={{ color:'#555' }}>{status}</Text>
      <View style={{ marginTop:10, flexDirection:'row', gap:8 }}>
        {!b && (
          <Pressable style={[styles.btn, styles.primary]} onPress={onBook}>
            <Text style={styles.btnTxt}>Book</Text>
          </Pressable>
        )}
        {isMine && b?.status === 'booked' && (
          <>
            <Pressable style={styles.btn} onPress={onCancel}>
              <Text style={styles.btnTxt}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.primary]} onPress={onCheckIn}>
              <Text style={styles.btnTxt}>Check-in</Text>
            </Pressable>
          </>
        )}
        {isMine && b?.status === 'checked_in' && (
          <Pressable style={styles.btn} onPress={onCancel}>
            <Text style={styles.btnTxt}>Finish</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{ borderWidth:1, borderColor:'#eee', backgroundColor:'#f7f7f7', borderRadius:14, padding:14 },
  title:{ fontSize:18, fontWeight:'800' },
  btn:{ backgroundColor:'#e5e7eb', paddingHorizontal:14, paddingVertical:10, borderRadius:10 },
  primary:{ backgroundColor:'#2563eb' },
  btnTxt:{ color:'white', fontWeight:'800' },
});
