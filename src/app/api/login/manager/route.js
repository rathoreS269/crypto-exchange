import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Manager from "@/models/Manager";

export async function POST(req) {
  await dbConnect();
  const { username, password } = await req.json();

  const manager = await Manager.findOne({ username });

  if (!manager) {
    return NextResponse.json({ success: false, message: "Manager not found" }, { status: 404 });
  }

  if (manager.password !== password) {
    return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
  }

  return NextResponse.json({ success: true, manager });
}
