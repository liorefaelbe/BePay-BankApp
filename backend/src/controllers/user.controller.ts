import { Response } from "express";
import { UserModel } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { getUserTransactionsWithSigns } from "../services/transaction.service";

// Get current user info
export async function getMeController(req: AuthRequest, res: Response) {
  const email = req.user.email;

  const user = await UserModel.findOne({ email }).select("email balance createdAt");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
}

// Get current user info with transactions
export async function getDashboard(req: AuthRequest, res: Response) {
  const email = req.user.email;

  const user = await UserModel.findOne({ email }).select("email phone balance createdAt");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const transactions = await getUserTransactionsWithSigns(email);

  res.json({
    email: user.email,
    phone: user.phone,
    balance: user.balance,
    transactions,
  });
}
