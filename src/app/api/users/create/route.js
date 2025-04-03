import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Manager from "@/models/Manager";
import mongoose from "mongoose";

export async function POST(req) {
  await dbConnect();
  const { managerUsername, username, password } = await req.json();

  if (!managerUsername || !username || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // 🔹 Step 1: Find manager by username and get its ObjectId
  const manager = await Manager.findOne({ username: managerUsername });
  if (!manager) {
    return NextResponse.json({ error: "Manager not found" }, { status: 404 });
  }

  // 🔹 Step 2: Check if the username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return NextResponse.json({ error: "Username already taken" }, { status: 400 });
  }

  // 🔹 Step 3: Create new user and store manager's ObjectId
  const newUser = await User.create({
    username,
    password,
    walletBalance: 0,
    manager: new mongoose.Types.ObjectId(manager._id) // ✅ Convert to ObjectId
  });

  // 🔹 Step 4: Add user to manager's user list
  manager.users.push(newUser._id);
  await manager.save();

  return NextResponse.json({ message: "User created successfully", user: newUser });
}
