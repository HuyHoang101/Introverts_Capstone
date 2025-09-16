import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './src/routes/user.route.js';
import postRoutes from './src/routes/post.route.js';
import commentRoutes from './src/routes/comment.route.js';
import likeRoutes from './src/routes/like.route.js';
import waterDataRoutes from './src/routes/waterData.route.js';
import electricityDataRoutes from './src/routes/electricityData.route.js';
import pollutionDataRoutes from './src/routes/pollutionData.route.js';
import roomRoutes from './src/routes/room.route.js';
import tableRoutes from './src/routes/table.route.js';
import deviceRoutes from './src/routes/device.route.js';
import bookingRoutes from './src/routes/bookingTable.route.js';
import authRoutes from './src/auth/auth.route.js';
import notificationRoutes from './src/routes/notification.route.js';
import notification2Routes from './src/routes/notification2.route.js';
import verifyRoutes from './src/routes/verify.route.js';
import chatRoute from "./src/routes/chat.route.js";
import reportRoute from "./src/routes/report.route.js";
import { startBookingReminderCron } from './src/notification/notification.cron.js';
import { startPollutionAlertCron } from './src/notification/pollutionNotification.cron.js';
import verifyPageRoute from './src/routes/verifyPage.route.js';
import conversationRoute from './src/routes/conversation.route.js';
import messageRoute from './src/routes/message.route.js';
import cors from 'cors';



dotenv.config();

const app = express();

app.use(cors({
  origin: ['https://greensyncintroverts.online', 'http://localhost:5000', ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/water-data', waterDataRoutes);
app.use('/api/electricity-data', electricityDataRoutes);
app.use('/api/pollution-data', pollutionDataRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/notification2', notification2Routes);
app.use('/api/auth/verify', verifyRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/reports", reportRoute);
app.use('/api', conversationRoute);
app.use('/api', messageRoute);
app.use('/', verifyPageRoute);
// Error handler phải có 4 tham số
app.use((err, _req, res, _next) => {
  console.error('[ERR]', err);                     // in full stack
  const code = err?.code;                          // Prisma error: P2003/P2025/…
  if (code === 'P2003') return res.status(400).json({ message: 'Invalid foreign key (e.g., conversationId)', code });
  if (code === 'P2025') return res.status(404).json({ message: 'Record not found', code });
  res.status(500).json({ message: err?.message || 'Internal error', code });
});
startBookingReminderCron();
startPollutionAlertCron();


app.listen(5000, '0.0.0.0', () => {
  console.log("Listening on port 5000");
});
