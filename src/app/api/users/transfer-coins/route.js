import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Manager from "@/models/Manager";

// export async function GET() {
//   return NextResponse.json({ message: "API is working!" });
// }

export async function POST(req) {
  console.log("🔹 API HIT ✅");
try {
  await dbConnect();
  const { user, manager, coins } = await req.json();

  // Validate input
  if (!user || !manager || isNaN(coins) || coins <= 0) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  // Find user and manager
  const foundUser = await User.findOne({ username: user });
  const foundManager = await Manager.findOne({ 
    username: { $regex: new RegExp(`^${manager}$`, "i") } 
  });
  console.log("🔍 Searching for Manager:", manager);
  console.log("🔍 Found Manager:", foundManager);

  if (!foundUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  if (!foundManager) {
    return NextResponse.json({ message: "Manager not found" }, { status: 404 });
  }

  // Check if user has enough coins
  if (foundUser.walletBalance < coins) {
    return NextResponse.json({ message: "Not enough balance" }, { status: 400 });
  }

  // Deduct from user and add to manager
  foundUser.walletBalance -= coins;
  foundManager.coinsAssigned += coins;

  await foundUser.save();
  await foundManager.save();

  return NextResponse.json({ message: "Coins sent successfully" }, { status: 200 });
} catch (error) {
  console.error("Error sending coins:", error);
  return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
}
}
