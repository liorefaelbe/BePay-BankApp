<<<<<<< HEAD
import { UserModel } from "../models/user.model";

// Check if user exists
export async function userExists(email: string): Promise<boolean> {
  const user = await UserModel.findOne({ email });
  return !!user;
}

// Retrieve user by email
export async function getUser(email: string) {
  return await UserModel.findOne({ email });
}

// Update user balance
export async function updateBalance(email: string, amount: number) {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("User not found");

  user.balance += amount;
  await user.save();
  return user;
}
=======
import { UserModel } from "../models/user.model";

// Check if user exists
export async function userExists(email: string): Promise<boolean> {
  const user = await UserModel.findOne({ email });
  return !!user;
}

// Retrieve user by email
export async function getUser(email: string) {
  return await UserModel.findOne({ email });
}

// Update user balance
export async function updateBalance(email: string, amount: number) {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("User not found");

  user.balance += amount;
  await user.save();
  return user;
}
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
