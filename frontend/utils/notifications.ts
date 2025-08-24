// lib/notifications.ts
import type { TimeIntervalTriggerInput } from 'expo-notifications';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Hiển thị thông báo khi app ở foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    // 2 field này có ở vài bản typings; nếu bản bạn không có cũng OK vì là runtime handler
    shouldShowBanner: true as any,
    shouldShowList: true as any,
  }),
});

export async function initNotifications() {
  // iOS + Android 13+: cần xin quyền
  const current = await Notifications.getPermissionsAsync();
  let status = current.status;
  if (status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return status;
}

// Helper: Date -> giây từ bây giờ (>=1s)
const secondsUntil = (when: Date) =>
  Math.max(1, Math.round((when.getTime() - Date.now()) / 1000));

export async function scheduleBookingReminders(args: {
  start: Date; end: Date; deskId: number; slotLabel: string;
}) {
  const { start, end, deskId, slotLabel } = args;
  const ids: string[] = [];
  const now = new Date();

  // -30 phút trước giờ bắt đầu
  const t30 = new Date(start.getTime() - 30 * 60 * 1000);
  if (t30 > now) {
    const trigger30: TimeIntervalTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsUntil(t30),
      repeats: false,
    };
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Upcoming desk booking',
        body: `${slotLabel} starts in 30 minutes. Check in within 15 minutes to keep your desk.`,
        data: { type: 'reminder-30m', deskId, slotLabel },
      },
      trigger: trigger30,
    });
    ids.push(id);
  }

  // -10 phút trước khi kết thúc
  const t10 = new Date(end.getTime() - 10 * 60 * 1000);
  if (t10 > now) {
    const trigger10: TimeIntervalTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsUntil(t10),
      repeats: false,
    };
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '10 minutes left',
        body: `Your ${slotLabel} ends in 10 minutes.`,
        data: { type: 'reminder-10m', deskId, slotLabel },
      },
      trigger: trigger10,
    });
    ids.push(id);
  }

  return ids;
}

export async function cancelScheduled(ids?: string[]) {
  if (!ids?.length) return;
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}
