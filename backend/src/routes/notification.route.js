import * as notificationController from '../controller/notification.controller.js';
import express from 'express';
const router = express.Router();

router.get('/', notificationController.getNotifications);
router.get('/:id', notificationController.getNotification);
router.post('/', notificationController.createNotification);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);
router.get('/user/:userId', notificationController.getNotificationsByUser);

export default router;