<<<<<<< HEAD
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: true },
  balance: { type: Number, required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = model("User", userSchema);
=======
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: true },
  balance: { type: Number, required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = model("User", userSchema);
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
