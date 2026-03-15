<<<<<<< HEAD
import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const TransactionModel = model("Transaction", transactionSchema);
=======
import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const TransactionModel = model("Transaction", transactionSchema);
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
