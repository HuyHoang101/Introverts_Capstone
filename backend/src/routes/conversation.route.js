// src/routes/conversation.route.js
import { Router } from 'express';
import {authenticateToken} from '../middleware/auth.js';
import { createOrGetDM, getMessages, getMyConversations } from '../controller/conversation.controller.js';

const router = Router();
router.use(authenticateToken);

router.post('/dm/:otherUserId', createOrGetDM);
router.get('/conversations', getMyConversations);
router.get('/conversations/:id/messages', getMessages);

export default router;
