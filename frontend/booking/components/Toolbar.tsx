import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, ScrollView } from 'react-native';
import DayPickerModal from './DayPickerModal';
import { SLOTS, SlotId } from '../constants/slots';
import { toYMD } from '../lib/time';

export default function Toolbar({
  dateYMD, onChangeDate, slotId, onChangeSlot,
}: { dateYMD:string; onChangeDate:(d:string)=>void; slotId:SlotId; onChangeSlot:(s:SlotId)=>void; }) {
  const today = useMemo(() => new Date(), []);
  const [showDays, setShowDays] = useState(false);
  const [showSlots, setShowSlots] = useState(false);
  const slot = SLOTS.find(s => s.id===slotId)!;

  return (
    <View>
      <View style={styles.row}>
        <Pressable style={styles.btn} onPress={() => setShowDays(true)}>
          <Text style={styles.btnTxt}>{dateYMD === toYMD(today) ? `Today (${dateYMD})` : dateYMD}</Text>
</Pressable>
        <Pressable style={styles.btn} onPress={() => setShowSlots(true)}>
          <Text style={styles.btnTxt}>{slot.label}</Text>
        </Pressable>
      </View>

      <DayPickerModal visible={showDays} onClose={() => setShowDays(false)} onPick={onChangeDate} startDate={today} />

      <Modal transparent animationType="fade" visible={showSlots} onRequestClose={() => setShowSlots(false)}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title}>Pick a slot</Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {SLOTS.map(s => (
                <Pressable key={s.id} style={styles.item} onPress={() => { onChangeSlot(s.id); setShowSlots(false); }}>
                  <Text style={styles.itemTxt}>{s.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={styles.closeBtn} onPress={() => setShowSlots(false)}><Text style={{ fontWeight:'700' }}>Close</Text></Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row:{ flexDirection:'row', gap:12 },
  btn:{ borderWidth:1, borderColor:'#ddd', backgroundColor:'#f7f7f7', paddingHorizontal:14, paddingVertical:10, borderRadius:12 },
  btnTxt:{ fontWeight:'800' },
  backdrop:{ flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center', padding:16 },
  card:{ width:'100%', maxWidth:460, backgroundColor:'#fff', borderRadius:16, padding:16 },
  title:{ fontSize:18, fontWeight:'800', marginBottom:8 },
  item:{ padding:12, borderRadius:10, borderWidth:1, borderColor:'#eee', backgroundColor:'#f7f7f7', marginBottom:8 },
  itemTxt:{ fontWeight:'700' },
  closeBtn:{ marginTop:8, alignSelf:'flex-end', paddingHorizontal:12, paddingVertical:8, borderRadius:10, backgroundColor:'#eee' },
});
