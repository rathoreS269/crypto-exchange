import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Manager from "@/models/Manager";

export async function GET(req, { params }) {
  await dbConnect();
  const { username } = params;

  const manager = await Manager.findOne({ username });

  if (!manager) {
    return NextResponse.json({ error: "Manager not found" }, { status: 404 });
  }

  const walletBalance = manager.coinsAssigned - manager.coinsUsed;

  return NextResponse.json({ balance: walletBalance });
}
