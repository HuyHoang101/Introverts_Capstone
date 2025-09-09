// routes/verifyPage.route.js
import { Router } from "express";
const router = Router();

router.get("/verify", (req, res) => {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  if (!token) return res.status(400).send("Missing token");

  const schemeUrl = `greensync://verify?token=${encodeURIComponent(token)}`;

  // Không render HTML, chuyển hướng thẳng sang app
  res.redirect(302, schemeUrl);
});

export default router;
