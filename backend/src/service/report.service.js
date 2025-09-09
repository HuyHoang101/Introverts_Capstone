import prisma from "../config/prisma.js";
import { chatWithBot } from "./chat.service.js";
import { broadcastPostNotifications } from "../notification/notification.post.js";


/**
 * Lưu report và gọi AI gợi ý
 */
export const createReportWithSuggestion = async (data) => {
  const report = await prisma.post.create({
    data,
    include: {
      author: true,
      Comment: true,
      like: true,
    },
  });
  report.then((p) => {
    // Tạo thông báo cho tất cả user
    broadcastPostNotifications(p.id).catch((err) => {
      console.error("Failed to broadcast post notifications", err);
    });
  });

  // Gọi AI để gợi ý xử lý
  const suggestion = await chatWithBot(data.description, { type: "report" });

  return { report, suggestion };
};
