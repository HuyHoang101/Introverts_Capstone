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



dotenv.config();

const app = express();
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


app.listen(5000, '0.0.0.0', () => {
  console.log("Listening on port 5000");
});
