import React from 'react';
import { View, Text } from 'react-native';

const Dot = ({ color }: { color: string }) => (
  <View style={{ width:10, height:10, borderRadius:5, backgroundColor:color, marginRight:6 }} />
);

export default function LegendBar() {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', gap:16, marginTop:8 }}>
      <View style={{ flexDirection:'row', alignItems:'center' }}><Dot color="#b7f7c1" /><Text>Free</Text></View>
      <View style={{ flexDirection:'row', alignItems:'center' }}><Dot color="#ffd966" /><Text>In use</Text></View>
      <View style={{ flexDirection:'row', alignItems:'center' }}><Dot color="#f8b4b4" /><Text>Booked</Text></View>
    </View>
  );
}
