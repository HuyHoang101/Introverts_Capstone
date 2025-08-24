import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SlotId } from '../constants/slots';
import { toYMD } from '@/utils/time';
import DayPickerModal from './DayPickerModal';
import SlotPicker from './SlotPicker';

type Props = {
  dateYMD: string;
  onChangeDate: (d: string) => void;
  slotId: SlotId;
  onChangeSlot: (s: SlotId) => void;
};

export default function Toolbar({ dateYMD, onChangeDate, slotId, onChangeSlot }: Props) {
  const [openDay, setOpenDay] = useState(false);
  const today = useMemo(() => new Date(), []);
  const todayLabel = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  return (
    <View style={styles.wrap}>
      {/* Date pill */}
      <Pressable style={[styles.pill, styles.flex]} onPress={() => setOpenDay(true)}>
        <Text style={styles.pillTxt}>
          {dateYMD === toYMD(today) ? `Today · ${todayLabel}` : dateYMD}
        </Text>
      </Pressable>

      {/* Time picker */}
      <SlotPicker value={slotId} onChange={onChangeSlot} style={styles.flex} />

      {/* Modal chọn ngày */}
      <DayPickerModal
        visible={openDay}
        onClose={() => setOpenDay(false)}
        onPick={(d) => { onChangeDate(d); setOpenDay(false); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'white',
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 8,
  },
  flex: { flex: 1 },
  pill: {
    flex: 1,
    borderWidth: 1, borderColor: '#ddd',
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  pillTxt: { fontWeight: '800', fontSize: 14, textAlign: 'center', color: '#000' },
});
