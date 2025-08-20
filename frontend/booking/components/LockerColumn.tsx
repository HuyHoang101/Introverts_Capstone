import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { LOCKER_NUMS } from '../constants/lockers';

export default function LockerColumn({ onPressLocker }: { onPressLocker: (n:number)=>void }) {
  return (
    <View style={styles.col}>
      <View style={styles.door} />
      {LOCKER_NUMS.map(n => (
        <Pressable key={n} style={styles.locker} onPress={() => onPressLocker(n)}>
          <Text style={styles.lockerTxt}>{n}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  col: { width:64, marginRight:10, alignItems:'center' },
  door:{ width:10, height:28, backgroundColor:'#111', borderRadius:4, marginBottom:8 },
  locker:{ width:56, height:44, backgroundColor:'#e5e7eb', borderRadius:10, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#d1d5db', marginBottom:12 },
  lockerTxt:{ fontWeight:'800' },
});
