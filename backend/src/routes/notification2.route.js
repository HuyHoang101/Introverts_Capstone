import express from 'express';
import * as c from '../controller/notification2.controller.js';
const router = express.Router();

router.get('/', c.listAll);
router.get('/user/:userId', c.listByUser);
router.patch('/:id/read', c.markRead);
router.post('/mark-all-read', c.markAllRead);

export default router;
