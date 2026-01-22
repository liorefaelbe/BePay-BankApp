import { Router } from "express";
import { authGuard } from "../middlewares/auth.middleware";
import { getMeController } from "../controllers/user.controller";
import { getDashboard } from "../controllers/user.controller";

const router = Router();

// Get current user profile
router.get("/me", authGuard, getMeController);
// Get user dashboard
router.get("/dashboard", authGuard, getDashboard);

export default router;
