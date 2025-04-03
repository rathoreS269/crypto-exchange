import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req, { params }) {
  await dbConnect();
  const { username } = params;

  const users = await User.find({ manager: username });
  return NextResponse.json(users);
}
