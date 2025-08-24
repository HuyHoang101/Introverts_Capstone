import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SLOTS, SlotId } from '../constants/slots';

type Props = { value: SlotId; onChange: (s: SlotId) => void };

export default function SlotChips({ value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {SLOTS.map(s => {
        const sel = s.id === value;
        return (
          <Pressable key={s.id} onPress={() => onChange(s.id)} style={[styles.chip, sel && styles.sel]}>
            <Text style={[styles.txt, sel && styles.selTxt]}>{s.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection:'row', gap:8, flexWrap:'wrap' },
  chip: { borderWidth:1, borderColor:'#ddd', paddingHorizontal:10, paddingVertical:6, borderRadius:999 },
  sel: { backgroundColor:'#e6f0ff', borderColor:'#2563eb' },
  txt: { color:'#444', fontWeight:'600' },
  selTxt: { color:'#1f3b99' },
});
