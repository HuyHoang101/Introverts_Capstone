// src/services/conversation.service.js
import prisma from '../config/prisma.js';

function sortPair(a, b) {
  return a < b ? [a, b] : [b, a];
}
function makeKey(a, b) {
  const [A, B] = sortPair(a, b);
  return `${A}#${B}`;
}

export async function getOrCreateDM(user1Id, user2Id) {
  if (user1Id === user2Id) throw new Error('You cannot DM yourself');
  const [A, B] = sortPair(user1Id, user2Id);
  const key = makeKey(user1Id, user2Id);

  // Upsert để chống race, unique theo participantKey
  const conv = await prisma.conversation.upsert({
    where: { participantKey: key },
    update: {},
    create: { participantKey: key, userAId: A, userBId: B }
  });
  return conv;
}

export async function listConversations(userId) {
  return prisma.conversation.findMany({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
    orderBy: { lastMessageAt: 'desc' }
  });
}

export async function ensureParticipant(conversationId, userId) {
  const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conv) throw new Error('Conversation not found');
  const isMember = conv.userAId === userId || conv.userBId === userId;
  if (!isMember) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return conv;
}
