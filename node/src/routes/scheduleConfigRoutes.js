import { Router } from "express";
import { getScheduleConfigByDate, createScheduleConfig } from "../controllers/scheduleConfigControllers.js";

const router = Router();

router.get("/config", getScheduleConfigByDate);
router.post("/createSchedule", createScheduleConfig);

export default router;
