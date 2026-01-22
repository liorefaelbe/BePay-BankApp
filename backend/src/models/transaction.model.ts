import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const TransactionModel = model("Transaction", transactionSchema);
