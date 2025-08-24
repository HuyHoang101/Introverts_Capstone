import React, { useState } from 'react';
import { Modal, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SLOTS, SlotId } from '../constants/slots';

type Props = {
  value: SlotId;
  onChange: (s: SlotId) => void;
  style?: StyleProp<ViewStyle>;     // 👈 mới
};

export default function SlotPicker({ value, onChange, style }: Props) {
  const [open, setOpen] = useState(false);
  const current = SLOTS.find(s => s.id === value)!;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Pick a time slot"
        style={[styles.button, style]}         // 👈 nhận style ngoài
        onPress={() => setOpen(true)}
      >
        <Text style={styles.buttonTxt}>{current.label}</Text>
      </Pressable>

      <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title} >Pick a time slot</Text>
            <View style={{ gap: 10 }}>
              {SLOTS.map(s => (
                <Pressable
                  key={s.id}
                  style={[styles.row, s.id === value && styles.rowSel]}
                  onPress={() => { onChange(s.id); setOpen(false); }}
                >
                  <Text style={styles.rowTxt} >{s.label}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={styles.closeBtn} onPress={() => setOpen(false)}>
              <Text style={styles.closeTxt}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,                       // 👈 để chia 1/2 hàng ngang
    borderWidth: 1, borderColor: '#ddd',
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 12,
  },
  buttonTxt: { fontWeight: '800', fontSize: 14, textAlign: 'center', color: '#000' },
  backdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center', padding:16 },
  card: { width:'100%', maxWidth:420, backgroundColor:'#fff', borderRadius:16, padding:18 },
  title: { fontSize:20, fontWeight:'800', marginBottom:14, color: '#000' },
  row: { padding:14, borderRadius:12, backgroundColor:'#f3f3f3' },
  rowSel: { backgroundColor:'#e6f0ff', borderWidth:1, borderColor:'#2563eb' },
  rowTxt: { fontSize:16, fontWeight:'700', color: '#000' },
  closeBtn:{ marginTop:14, alignSelf:'flex-end', paddingHorizontal:14, paddingVertical:10, borderRadius:12, backgroundColor:'#e5e5e5' },
  closeTxt:{ fontWeight:'800', color: '#000' },
});
