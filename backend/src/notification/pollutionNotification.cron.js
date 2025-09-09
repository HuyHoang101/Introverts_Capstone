// pollutionNotification.cron.js
import cron from 'node-cron';
import prisma from '../config/prisma.js';
import { formatInTimeZone } from 'date-fns-tz';

const TZ = 'Asia/Ho_Chi_Minh';

function fmtLocal(date) {
  return formatInTimeZone(date, TZ, "HH:mm 'date' dd/MM/yyyy");
}

// Công thức calculateDangerScore dựa trên các chỉ số ô nhiễm không khí phổ biến
// Tham khảo: https://www.airnow.gov/aqi/
// Chỉ số PM2.5, PM10, NO2, O3, CO
// Mỗi chỉ số được chuẩn hóa về thang điểm 0-20, tổng điểm tối đa là 100
// Ngưỡng cảnh báo: > 40 điểm
const calculateDangerScore = (data) => {
  let sum = 0;
  sum += Math.min(20, (data.pm25 * 20) / 55);
  sum += Math.min(20, (data.pm10 * 20) / 254);
  sum += Math.min(20, (data.no2 * 20) / 360);
  sum += Math.min(20, (data.o3 * 20) / 85);
  sum += Math.min(20, (data.co * 20) / 12.4);
  return Math.round(sum * 10) / 10;
};

async function createPollutionNotifications() {
  // Lấy các bản ghi pollutionData mới nhất (có thể chỉ lấy bản ghi trong vài phút gần đây)
  const now = new Date();
  const windowStart = new Date(now.getTime() - 5 * 60 * 1000); // 5 phút gần đây

  const pollutionRecords = await prisma.pollutionData.findMany({
    where: {
      createdAt: { gte: windowStart },
    },
  });

  if (!pollutionRecords.length) return;

  // Lấy user có role ADMIN
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, name: true },
  });

  if (!admins.length) return;

  const notifications = [];

  pollutionRecords.forEach((p) => {
    const dangerScore = calculateDangerScore(p);

    if (dangerScore > 40) {
      const when = fmtLocal(p.createdAt);
      const title = `⚠️ High Pollution Alert – Danger Score: ${dangerScore}`;
      const content = `Measured at ${when}. Danger score is ${dangerScore}.`;

      admins.forEach((admin) => {
        notifications.push({
          userId: admin.id,
          type: 'POLLUTION_ALERT',
          refId: p.id,
          scheduledFor: p.createdAt,
          title,
          content,
        });
      });
    }
  });

  if (notifications.length > 0) {
    await prisma.notification.createMany({
      data: notifications,
      skipDuplicates: true,
    });
  }
}

export function startPollutionAlertCron() {
  // Chạy mỗi 1 phút
  cron.schedule('*/60 * * * * *', async () => {
    try {
      await createPollutionNotifications();
    } catch (err) {
      console.error('[pollution alert cron] error', err);
    }
  });
}
