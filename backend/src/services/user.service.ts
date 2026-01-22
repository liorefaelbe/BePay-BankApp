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
