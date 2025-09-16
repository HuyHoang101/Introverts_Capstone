// src/service/report.service.js
import prisma from "../config/prisma.js";
import { chatWithBot } from "./chat.service.js";
import { broadcastPostNotifications } from "../notification/notification.post.js";

/**
 * Tạo post (report) + gửi thông báo đến mọi user khác + gọi AI gợi ý.
 * - Không để lỗi notification/AI làm fail việc tạo post.
 * - Trả về { report, suggestion | null }.
 */
export const createReportWithSuggestion = async (data) => {
  // 1) Tạo Post trước
  const report = await prisma.post.create({
    data,
    include: {
      author: true,
      Comment: true,
      like: true,
    },
  });

  // 2) Chạy notification & AI song song, nhưng KHÔNG làm fail response nếu một trong hai lỗi
  const [notifRes, suggRes] = await Promise.allSettled([
    // gửi thông báo cho tất cả user khác (không block)
    broadcastPostNotifications(report.id),
    // gọi AI gợi ý (có thể fail -> suggestion = null)
    chatWithBot(data.description, { type: "report", postId: report.id, location: data.location }),
  ]);

  const suggestion =
    suggRes.status === "fulfilled" ? suggRes.value : null;

  if (notifRes.status === "rejected") {
    console.error("Failed to broadcast post notifications", notifRes.reason);
  }

  return { report, suggestion };
};


