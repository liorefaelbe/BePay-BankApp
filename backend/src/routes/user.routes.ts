<<<<<<< HEAD
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
=======
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
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
