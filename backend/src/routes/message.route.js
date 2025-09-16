// src/routes/message.route.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { postMessage } from '../controller/message.controller.js';

const router = Router();
router.use(authenticateToken);

router.post('/messages', postMessage);

export default router;
