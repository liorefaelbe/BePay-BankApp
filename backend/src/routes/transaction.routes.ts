import { Router } from "express";
import { transferMoney, getTransactionHistory } from "../controllers/transaction.controller";
import { authGuard } from "../middlewares/auth.middleware";
import { transferLimiter } from "../middlewares/rateLimit.middleware";
import { validate } from "../utils/validators";
import { transferSchema } from "../utils/validators";

const router = Router();

// Protected routes with auth guard
router.post("/transfer", authGuard, transferLimiter, validate(transferSchema), transferMoney);
router.get("/history", authGuard, getTransactionHistory);

export default router;
