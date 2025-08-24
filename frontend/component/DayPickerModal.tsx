import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { addDays, toYMD } from '@/utils/time';

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (dateYMD: string) => void;
};

export default function DayPickerModal({ visible, onClose, onPick }: Props) {
  const today = new Date();

  // ✅ Bao gồm cả TODAY + 7 ngày tiếp theo
  const days = Array.from({ length: 8 }, (_, i) => addDays(today, i));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Pick a day</Text>

          <View style={{ gap: 10 }}>
            {days.map((d, idx) => {
              const ymd = toYMD(d);
              const dd = d.getDate().toString().padStart(2, '0');
              const mm = (d.getMonth() + 1).toString().padStart(2, '0');
              const w = d.toLocaleDateString(undefined, { weekday: 'short' });
              const label = idx === 0 ? `Today · ${dd}/${mm} (${w})` : `${dd}/${mm} (${w})`;

              return (
                <Pressable key={ymd} style={styles.row} onPress={() => { onPick(ymd); onClose(); }}>
                  <Text style={styles.rowText} >{label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeTxt} >Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center', padding:16 },
  card: { width:'100%', maxWidth:420, backgroundColor:'#fff', borderRadius:16, padding:18 },
  title: { fontSize:20, fontWeight:'800', marginBottom:14 },
  row: { padding:14, borderRadius:12, backgroundColor:'#f3f3f3' },
  rowText: { fontSize:16, fontWeight:'700', color: '#000' },
  closeBtn:{ marginTop:14, alignSelf:'flex-end', paddingHorizontal:14, paddingVertical:10, borderRadius:12, backgroundColor:'#e5e5e5' },
  closeTxt:{ fontWeight:'800', color: '#000' },
});
