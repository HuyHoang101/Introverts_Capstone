import { sendVerifyEmailService, consumeVerifyTokenService } from "../service/verify.service.js";

/**
 * POST /auth/verify/request
 * body: { email }
 * - Luôn trả { ok: true } để tránh enumeration
 */
export async function requestVerifyController(req, res) {
  try {
    const { email } = req.body || {};
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    await sendVerifyEmailService(email);
    return res.json({ ok: true });
  } catch (err) {
    console.error("requestVerifyController error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}

/**
 * GET /auth/verify/consume?token=...
 * - Redirect về WEB_CONFIRM_URL khi thành công
 */
export async function consumeVerifyController(req, res) {
  try {
    const { token } = req.query || {};
    if (!token) return res.status(400).send("Missing token");

    await consumeVerifyTokenService(token);

    const redirectTo = process.env.WEB_CONFIRM_URL || "/";
    return res.redirect(302, redirectTo);
  } catch (err) {
    console.error("consumeVerifyController error:", err);
    return res.status(400).send("Invalid or expired token");
  }
}
