// src/services/notification.service.js
import prisma from '../config/prisma.js';

export async function notifyNewMessage({ recipientId, conversationId, messageId, senderName }) {
  await prisma.notification2.create({
    data: {
      userId: recipientId,
      type: 'NEW_MESSAGE',
      title: 'New Message Received',
      body: `You have new message from ${senderName}`,
      conversationId,
      messageId
    }
  });
  // TODO: tích hợp push (Expo/FCM/APNS) nếu cần
}
