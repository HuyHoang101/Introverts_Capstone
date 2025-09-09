// components/LegendBar.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LegendBar() {
  const Item = ({ c, t }: { c: string; t: string }) => (
    <View style={styles.item}>
      <View style={[styles.dot, { backgroundColor: c }]} />
      <Text style={styles.txt} >{t}</Text>
    </View>
  );
  return (
    <View style={styles.wrap}>
      <Item c="#c8f7c5" t="Free" />
      <Item c="#ffb3b3" t="Other's" />
      <Item c="#fff1a6" t="Your" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 16, alignItems: 'center', marginTop: 8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  txt: { fontWeight: '700', color: '#000' },
});
