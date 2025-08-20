import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';

const DATA: Record<number, {id:string; name:string; desc:string}[]> = {
  1: [
    { id:'1A', name:'Microscope', desc:'Optical instrument for magnifying small objects.' },
    { id:'1B', name:'Lab Gloves', desc:'Disposable nitrile gloves for experiments.' },
    { id:'1C', name:'Pipette Set', desc:'Adjustable micropipettes with tips.' },
  ],
  2: [
    { id:'2A', name:'Test Tubes', desc:'Glass tubes for chemical reactions.' },
    { id:'2B', name:'pH Meter', desc:'Measures acidity/alkalinity of solutions.' },
    { id:'2C', name:'Bunsen Burner', desc:'Gas burner for heating and sterilization.' },
  ],
  3: [
    { id:'3A', name:'Beaker Set', desc:'Various sizes for mixing liquids.' },
    { id:'3B', name:'Glass Rods', desc:'Stirring rods made of glass.' },
    { id:'3C', name:'Safety Goggles', desc:'Eye protection during experiments.' },
  ],
  4: [
    { id:'4A', name:'Centrifuge Tubes', desc:'Tubes for centrifugation.' },
    { id:'4B', name:'Hot Plate', desc:'Surface for controlled heating.' },
    { id:'4C', name:'Weighing Paper', desc:'Paper used for weighing solids.' },
  ],
  5: [
    { id:'5A', name:'Volumetric Flask', desc:'High-precision flask for fixed volumes.' },
    { id:'5B', name:'Thermometer', desc:'Measures temperature.' },
    { id:'5C', name:'Tongs', desc:'Gripping hot glassware and crucibles.' },
  ],
};

export default function LockerModal({ visible, locker, onClose }:{
  visible:boolean; locker:number|null; onClose:()=>void;
}) {
  const items = locker ? DATA[locker] : [];

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Locker {locker ?? '-'}</Text>
          {!items?.length && <Text style={{ color:'#666' }}>No data.</Text>}
          {items?.map(it => (
            <View key={it.id} style={styles.item}>
              <Text style={styles.itemTitle}>{it.id} — {it.name}</Text>
              <Text style={styles.itemText}>{it.desc}</Text>
            </View>
          ))}
          <Pressable style={styles.closeBtn} onPress={onClose}><Text style={{ fontWeight:'800' }}>Close</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:{ flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center', padding:16 },
  card:{ width:'100%', maxWidth:460, backgroundColor:'#fff', borderRadius:16, padding:18 },
  title:{ fontSize:20, fontWeight:'800', marginBottom:10 },
  item:{ paddingVertical:8, borderTopWidth:1, borderTopColor:'#eee' },
  itemTitle:{ fontWeight:'800' },
  itemText:{ color:'#374151' },
  closeBtn:{ marginTop:14, alignSelf:'flex-end', paddingHorizontal:14, paddingVertical:10, borderRadius:10, backgroundColor:'#eee' },
});
