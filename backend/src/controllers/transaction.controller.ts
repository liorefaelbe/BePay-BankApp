import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { UserModel } from "../models/user.model";
import { transfer, getUserTransactionsWithSigns } from "../services/transaction.service";
import { notifyUser } from "../socket";

// Get transaction history for the authenticated user
export async function getTransactionHistory(req: AuthRequest, res: Response) {
  try {
    const email = req.user.email;

    const transactions = await getUserTransactionsWithSigns(email);

    res.json({
      transactions,
      count: transactions.length,
    });
  } catch (error) {
    console.error("Get transaction history error:", error);
    res.status(500).json({
      message: "Failed to retrieve transaction history",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Handle money transfer between users
export async function transferMoney(req: AuthRequest, res: Response) {
  const fromEmail = req.user.email;
  const { toEmail, amount } = req.body;

  if (!toEmail || amount <= 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const receiver = await UserModel.findOne({ email: toEmail });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const sender = await UserModel.findOne({ email: fromEmail });
    if (!sender || sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Use the transfer service with MongoDB transaction
    await transfer(fromEmail, toEmail, amount);

    // ✨ Send real-time notification to receiver via WebSocket
    notifyUser(toEmail, {
      type: "TRANSFER_RECEIVED",
      from: fromEmail,
      amount: amount,
      message: `You received $${amount} from ${fromEmail}`,
      timestamp: new Date().toISOString(),
    });

    console.log(`💸 Transfer successful: ${fromEmail} → ${toEmail} ($${amount})`);
    console.log(`📢 Notification sent to ${toEmail}`);

    res.json({
      message: "Transfer successful",
      transfer: {
        to: toEmail,
        amount: amount,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Transfer error:", error);
    res.status(500).json({
      message: "Transfer failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
