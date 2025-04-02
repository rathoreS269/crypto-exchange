import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Manager from "@/models/Manager";

export async function GET() {
  await dbConnect();
  const managers = await Manager.find({});
  return NextResponse.json({ managers }, { status: 200 });
}
