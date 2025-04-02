import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Manager from "@/models/Manager";

export async function POST(req) {
  try {
    await dbConnect();
    const { username, coins } = await req.json();

    // Check if coins is a valid number
    const coinsToAdd = parseInt(coins);
    if (isNaN(coinsToAdd) || coinsToAdd <= 0) {
      return NextResponse.json({ message: "Invalid coins amount" }, { status: 400 });
    }

    // Find the manager
    const manager = await Manager.findOne({ username });
    if (!manager) {
      return NextResponse.json({ message: "Manager not found" }, { status: 404 });
    }

    // Update coinsAssigned (not coins)
    manager.coinsAssigned += coinsToAdd;
    await manager.save();

    return NextResponse.json({ message: "Coins added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding coins:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
