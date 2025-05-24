import express, { json } from 'express';
import cors from 'cors';
import waterRouter from './routers/water.js';
import populationRouter from './routers/population.js';
import airRouter from './routers/air.js';
import transportationRouter from './routers/transportation.js';
import electricRouter from './routers/electric.js';

const app = express();
const port = 5000;

// API routes
app.use(json());
app.use(cors());
app.use('/api/water', waterRouter);
app.use('/api/population', populationRouter);
app.use('/api/air', airRouter);
app.use('/api/transportation', transportationRouter);
app.use('/api/electric', electricRouter);

let reports = [];
// Nhận report từ frontend
app.post('/api/report', (req, res) => {
  const report = req.body;
  reports.push(report); // lưu vào RAM
  console.log('Received report:', report);
  res.status(200).json({ message: 'Report saved temporarily in memory' });
});

// Trả danh sách tất cả report
app.get('/api/report', (req, res) => {
  res.status(200).json(reports);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`It combine:`);
  console.log(`Server running at http://localhost:${port}/api/water`);
  console.log(`Server running at http://localhost:${port}/api/population`);
  console.log(`Server running at http://localhost:${port}/api/air`);
  console.log(`Server running at http://localhost:${port}/api/transportation`);
  console.log(`Server running at http://localhost:${port}/api/electric`);
});
