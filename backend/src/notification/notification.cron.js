// notification.cron.js
import cron from 'node-cron';
import prisma from '../config/prisma.js';
import { formatInTimeZone } from 'date-fns-tz';

const TZ = 'Asia/Ho_Chi_Minh';

function fmtLocal(date) {
  return formatInTimeZone(date, TZ, "HH:mm 'date' dd/MM/yyyy");
}

async function createBookingNotifications(phase) {
  const now = new Date();
  const offsetSec = phase === '15m' ? 15 * 60 : 0;

  const windowStart = new Date(now.getTime() + (offsetSec - 30) * 1000);
  const windowEnd   = new Date(now.getTime() + (offsetSec + 30) * 1000);

  const bookings = await prisma.bookingTable.findMany({
    where: {
      startTime: { gte: windowStart, lt: windowEnd },
    },
    include: {
      table: true,
      user: { select: { id: true, name: true } },
    },
  });

  if (!bookings.length) return;

  const data = bookings.map((b) => {
    const when = fmtLocal(b.startTime);
    const is15m = phase === '15m';
    const title = is15m
      ? 'Note: 15 minutes until reservation time'
      : 'Reservation time – please check-in';
    const content = is15m
      ? `Table: ${b.table.name}. Start time: ${when}. Slot #${b.slotId}.`
      : `Table: ${b.table.name}. Time starts now (${when}). Slot #${b.slotId}.`;

    return {
      userId: b.userId,
      type: is15m ? 'BOOKING_REMINDER_15M' : 'BOOKING_START',
      refId: b.id,
      scheduledFor: b.startTime,
      title,
      content,
    };
  });

  await prisma.notification.createMany({
    data,
    skipDuplicates: true,
  });
}

export function startBookingReminderCron() {
  // Mỗi 30 giây
  cron.schedule('*/30 * * * * *', async () => {
    try {
      await createBookingNotifications('15m');
      await createBookingNotifications('start');
    } catch (err) {
      console.error('[booking reminder cron] error', err);
    }
  });
}
