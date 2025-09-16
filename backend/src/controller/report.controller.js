// src/controller/report.controller.js
import { createReportWithSuggestion } from "../service/report.service.js";

export const reportController = async (req, res) => {
  try {
    const { description, userId, title, problem, location, content, published } = req.body;

    // validate rõ ràng theo schema Post
    if (!userId)        return res.status(400).json({ error: "Missing userId" });
    if (!title)         return res.status(400).json({ error: "Missing title" });
    if (!problem)       return res.status(400).json({ error: "Missing problem" });
    if (!description)   return res.status(400).json({ error: "Missing description" });
    if (!location)      return res.status(400).json({ error: "Missing location" });

    // Map đúng sang schema Post (authorId, ...):
    const data = {
      title,
      problem,
      description,
      location,
      content: content ?? null,
      authorId: userId,
      published: published ?? false,
    };

    const result = await createReportWithSuggestion(data);
    // 201 vì đã tạo tài nguyên
    res.status(201).json(result);

  } catch (err) {
    console.error("❌ reportController error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
};
