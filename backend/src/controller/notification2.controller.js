import prisma from '../config/prisma.js';

export async function listByUser(req, res) {
  const { userId } = req.params;
  const rows = await prisma.notification2.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(rows);
}

export async function markRead(req, res) {
  const { id } = req.params;
  const row = await prisma.notification2.update({
    where: { id },
    data: { readAt: new Date() },
  });
  res.json(row);
}

export async function markAllRead(req, res) {
  const { userId } = req.body ?? {};
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  const r = await prisma.notification2.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
  res.json({ count: r.count });
}

export async function listAll(_req, res) {
  const rows = await prisma.notification2.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(rows);
}
