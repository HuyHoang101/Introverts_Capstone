const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Backend is running at http://0.0.0.0:${port}`);
});
