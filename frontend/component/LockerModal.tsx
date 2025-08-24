// components/LockerModal.tsx
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LOCKER_CONTENTS, LockerItem } from '../constants/lockers';

type Props = {
  visible: boolean;
  locker: number | null;
  onClose: () => void;
};

export default function LockerModal({ visible, locker, onClose }: Props) {
  const items: LockerItem[] = locker ? LOCKER_CONTENTS[locker] : [];
  const [active, setActive] = useState<string | null>(null);

  const toggle = (id: string) => setActive(prev => (prev === id ? null : id));

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Locker {locker ?? '-'}</Text>

          <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ gap: 10 }}>
            {items?.map(it => {
              const open = active === it.id;
              return (
                <View key={it.id} style={styles.itemWrap}>
                  <Pressable style={[styles.item, open && styles.itemOpen]} onPress={() => toggle(it.id)}>
                    <Text style={styles.itemTitle}>Locker {it.id}</Text>
                    <Text style={styles.itemSub} >{it.name}</Text>
                    <Text style={styles.meta}>
                      Qty: {it.quantity}  ·  Weight: {it.weight}
                    </Text>
                    <Text style={styles.hint}>(Tap to {open ? 'collapse' : 'read more'})</Text>
                  </Pressable>

                  {open && (
                    <View style={styles.detail}>
                      <Section label="Overview" text={it.overview} />
                      <Section label="How to use" text={it.usage} />
                      <Section label="Purpose" text={it.purpose} />
                      <Section label="History" text={it.history} />
                    </View>
                  )}
                </View>
              );
            })}
            {!items?.length && <Text style={{ color: '#666' }}>No data.</Text>}
          </ScrollView>

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeTxt} >Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Section({ label, text }: { label: string; text: string }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={styles.sectionText} >{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 460, backgroundColor: '#fff', borderRadius: 16, padding: 18 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 14, color: '#000' },

  itemWrap: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' },
  item: { padding: 12, backgroundColor: '#f3f4f6' },
  itemOpen: { backgroundColor: '#eef6ff' },

  itemTitle: { fontWeight: '800', marginBottom: 2, color: '#000' },
  itemSub: { color: '#111827' },
  meta: { color: '#374151', marginTop: 4, fontSize: 12 },
  hint: { color: '#6b7280', marginTop: 2, fontSize: 12 },

  detail: { padding: 12, gap: 10, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e5e7eb' },

  sectionLabel: { fontWeight: '800', color: '#000' },
  sectionText: { color: '#374151' },

  closeBtn: { marginTop: 14, alignSelf: 'flex-end', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: '#e5e5e5' },
  closeTxt: { fontWeight: '800' },
});
