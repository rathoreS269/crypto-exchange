import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Manager from "@/models/Manager";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const { username, user, coins } = await req.json();  // `user` = jisko coins milne chahiye

    if (!username || !user || isNaN(coins) || coins <= 0) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    // ✅ Step 1: Find Manager
    const manager = await Manager.findOne({ username });
    if (!manager) {
      return NextResponse.json({ message: "Manager not found" }, { status: 404 });
    }

    // ✅ Step 2: Find User
    const foundUser = await User.findOne({ username: user });
    if (!foundUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Step 3: Check if Manager has Enough Coins
    if (manager.coinsAssigned - manager.coinsUsed < coins) {
      return NextResponse.json({ message: "Not enough coins in manager wallet" }, { status: 400 });
    }

    // ✅ Step 4: Update Manager & User
    manager.coinsUsed += coins; // Deduct coins from manager
    foundUser.walletBalance += coins; // Add coins to user

    await manager.save();
    await foundUser.save();

    return NextResponse.json({ message: "Coins transferred successfully", success: true }, { status: 200 });
  } catch (error) {
    console.error("Error adding coins:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
