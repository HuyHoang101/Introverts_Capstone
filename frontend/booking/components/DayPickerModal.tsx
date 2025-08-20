import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { nextDays } from '../lib/time';

export default function DayPickerModal({
  visible, onClose, onPick, startDate, count=8,
}: { visible:boolean; onClose:()=>void; onPick:(d:string)=>void; startDate:Date; count?:number; }) {
  const days = nextDays(startDate, count);

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Pick a day</Text>
          <ScrollView style={{ maxHeight: 400 }}>
            {days.map(d => (
              <Pressable key={d} style={styles.item} onPress={() => { onPick(d); onClose(); }}>
                <Text style={styles.itemTxt}>{d}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable style={styles.closeBtn} onPress={onClose}><Text style={{ fontWeight:'700' }}>Close</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:{ flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center', padding:16 },
  card:{ width:'100%', maxWidth:460, backgroundColor:'#fff', borderRadius:16, padding:16 },
  title:{ fontSize:20, fontWeight:'800', marginBottom:12 },
  item:{ padding:12, borderRadius:12, borderWidth:1, borderColor:'#eee', backgroundColor:'#f7f7f7', marginBottom:8 },
  itemTxt:{ fontWeight:'700' },
  closeBtn:{ marginTop:10, alignSelf:'flex-end', paddingHorizontal:12, paddingVertical:8, backgroundColor:'#eee', borderRadius:10 },
});
