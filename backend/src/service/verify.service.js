import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { sendMail } from "../lib/mail.js";
import { verifyEmailTemplate } from "../lib/verifyEmailTemplate.js";

/**
 * Tạo link xác nhận và gửi email.
 * - Không tiết lộ user tồn tại hay không (controller sẽ luôn trả {ok:true})
 */
export async function sendVerifyEmailService(email) {
  // Tìm user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Không báo lỗi để tránh email enumeration
    return { ok: true, skipped: true };
  }

  // Ký JWT ngắn hạn
  const token = jwt.sign(
    { uid: user.id, email: user.email, purpose: "verify" },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  // Link tiêu thụ token -> controller consume
  const baseUrl =
    process.env.PUBLIC_BASE_URL || `http://localhost:5000`;
  const link = `${baseUrl}/auth/verify/consume?token=${encodeURIComponent(token)}`;

  // Gửi email
  const html = verifyEmailTemplate(link);
  await sendMail({ to: email, subject: "Xác nhận email", html });

  return { ok: true };
}

/**
 * Xác thực token và đánh dấu verified
 */
export async function consumeVerifyTokenService(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (payload.purpose !== "verify") {
    throw new Error("Invalid token purpose");
  }

  // Đặt emailVerifiedAt = now()
  await prisma.user.update({
    where: { id: payload.uid },
    data: { emailVerifiedAt: new Date() },
  });

  return { ok: true };
}
