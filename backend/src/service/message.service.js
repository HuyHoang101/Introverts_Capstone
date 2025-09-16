// src/services/message.service.js
import prisma from '../config/prisma.js';
import { ensureParticipant } from './conversation.service.js';

const ONE_HOUR_MS = 60 * 60 * 1000;

export async function sendMessage({ conversationId, senderId, content }) {
  return prisma.$transaction(async (tx) => {
    const conv = await tx.conversation.findUnique({ where: { id: conversationId } });
    if (!conv) throw new Error('Conversation not found');

    if (conv.userAId !== senderId && conv.userBId !== senderId) {
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    }

    const recipientId = senderId === conv.userAId ? conv.userBId : conv.userAId;

    const msg = await tx.message.create({
      data: { conversationId, senderId, content }
    });

    const now = new Date();
    const prev = conv.lastMessageAt ? new Date(conv.lastMessageAt) : null;
    const shouldNotify = !prev || (now.getTime() - prev.getTime()) >= ONE_HOUR_MS;

    await tx.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: now }
    });

    if (shouldNotify) {
      const sender = await tx.user.findUnique({
        where: { id: senderId },
        select: { name: true, email: true }
      });
      const senderName = sender?.name || sender?.email || 'Unknown user';

      await tx.notification2.create({
        data: {
          userId: recipientId,
          type: 'NEW_MESSAGE', //enum NotificationType { NEW_MESSAGE }
          title: 'New Message Received',
          body: `You have new message from ${senderName}`,
          conversationId,
          messageId: msg.id
        }
      });
    }

    return msg;
  });
}

export async function listMessages({ conversationId, userId, cursor, limit }) {
  await ensureParticipant(conversationId, userId);

  const where = { conversationId };
  if (cursor) where.createdAt = { lt: new Date(cursor) };

  const rows = await prisma.message.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit + 1
  });

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? items[items.length - 1].createdAt.toISOString() : null;

  return { items, nextCursor, hasMore };
}
