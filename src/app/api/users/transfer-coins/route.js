import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Manager from "@/models/Manager";

export async function POST(req) {
  await dbConnect();
  const { managerUsername, userUsername, coins } = await req.json();

  if (!managerUsername || !userUsername || !coins) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Manager ko find karo
  const manager = await Manager.findOne({ username: managerUsername });
  if (!manager) {
    return NextResponse.json({ error: "Manager not found" }, { status: 404 });
  }

  // User ko find karo
  const user = await User.findOne({ username: userUsername });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check karo ki manager ke paas itne coins hain ya nahi
  if (manager.coinsAssigned - manager.coinsUsed < coins) {
    return NextResponse.json({ error: "Not enough coins" }, { status: 400 });
  }

  // Coins transfer karo
  user.walletBalance -= coins;
  manager.coinsUsed += coins;

  await user.save();
  await manager.save();

  return NextResponse.json({ message: "Coins transferred successfully", user });
}
