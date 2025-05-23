import express, { json } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

app.use(json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Backend is running at http://0.0.0.0:${port}`);
});
