import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
  const data = JSON.parse(
    readFileSync(path.join(__dirname, '../data/water.json'), 'utf-8')
  );
  res.json(data);
});

export default router;
