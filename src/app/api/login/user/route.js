import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();
  const { username, password } = await req.json();

  const user = await User.findOne({ username, password });
  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ message: "Login successful" }, { status: 200 });
}
