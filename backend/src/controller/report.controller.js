import { createReportWithSuggestion } from "../service/report.service.js";

export const reportController = async (req, res) => {
  try {
    const { description, userId } = req.body;

    // validate cơ bản
    if (!description || !userId) {
      return res.status(400).json({ error: "Missing described message or userId" });
    }

    // gửi nguyên req.body sang service
    const result = await createReportWithSuggestion(req.body);

    res.json(result);
  } catch (err) {
    console.error("❌ reportController error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
};
