import { UserModel } from "../models/user.model";
import { TransactionModel } from "../models/transaction.model";
import mongoose from "mongoose";

// Perform a transfer between two users (with MongoDB transaction)
export async function transfer(from: string, to: string, amount: number) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await UserModel.findOne({ email: from }).session(session);
    const receiver = await UserModel.findOne({ email: to }).session(session);

    if (!sender || !receiver) {
      throw new Error("User not found");
    }

    if (sender.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Update balances
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    // Create transaction record
    await TransactionModel.create([{ from, to, amount }], { session });

    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

// Get transactions for a user with signed amounts
export async function getUserTransactionsWithSigns(email: string) {
  const transactions = await TransactionModel.find({
    $or: [{ from: email }, { to: email }],
  }).sort({ createdAt: -1 });

  return transactions.map((t) => ({
    counterparty: t.from === email ? t.to : t.from,
    amount: t.from === email ? -t.amount : t.amount,
    createdAt: t.createdAt,
  }));
}
