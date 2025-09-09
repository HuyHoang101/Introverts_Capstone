import express from "express";
import { reportController } from "../controller/report.controller.js";

const router = express.Router();

router.post("/", reportController);

export default router;
