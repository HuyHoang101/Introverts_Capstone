import express from "express";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/email.js";

const router = express.Router();

// B1: Yêu cầu gửi email xác nhận
router.post("/request", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    // tạo token có hạn 15 phút
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const ok = await sendVerificationEmail(email, token);
    if (!ok) return res.status(500).json({ error: "Send email failed" });

    res.json({ success: true, message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// B2: Người dùng bấm vào link -> xác thực token
router.get("/consume", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👉 ở đây cậu có thể set 1 flag vào DB, hoặc trả về frontend
    res.json({ success: true, email: decoded.email });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

export default router;
