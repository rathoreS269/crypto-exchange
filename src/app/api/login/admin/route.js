import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { username, password } = body;

  // Check against env credentials
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
}
