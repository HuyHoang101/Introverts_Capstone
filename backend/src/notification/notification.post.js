// notification.post.js
import prisma from '../config/prisma.js';

export async function broadcastPostNotifications(postId) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    // LẤY THÊM authorId + createdAt để dùng lọc & scheduledFor ổn định
    select: { id: true, title: true, description: true, authorId: true, createdAt: true },
  });
  if (!post) return;

  // LỌC: loại trừ tác giả
  const users = await prisma.user.findMany({
    where: { id: { not: post.authorId } },
    select: { id: true },
  });
  if (!users.length) return;

  const desc = post.description || '';
  const preview = desc.length > 140 ? desc.slice(0, 140) + '…' : desc;

  const data = users.map(({ id }) => ({
    userId: id,
    type: 'POST_NEW',
    refId: post.id,
    // Dùng thời điểm tạo bài post để chống trùng nếu broadcast lại:
    scheduledFor: post.createdAt,
    title: `Bài viết mới: ${post.title}`,
    content: preview || 'Có báo cáo mới vừa được đăng.',
  }));

  await prisma.notification.createMany({
    data,
    skipDuplicates: true, // hiệu lực khi có unique index (vd: @@unique([userId, type, refId, scheduledFor]))
  });
}
