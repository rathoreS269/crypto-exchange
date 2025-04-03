import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Manager from "@/models/Manager"; // Ensure correct model name

export async function GET(req, { params }) {
  await dbConnect();

  console.log("Received Params:", params); // 🔍 Debugging ke liye

  const { username } = params;
  if (!username) {
    return NextResponse.json({ error: "Manager username is required" }, { status: 400 });
  }

  try {
    const manager = await Manager.findOne({ username: username.toLowerCase() });

    console.log("Fetched Manager:", manager); // 🔍 Debugging

    if (!manager) {
      return NextResponse.json({ error: "Manager not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, manager });
  } catch (error) {
    console.error("Error fetching manager:", error);
    return NextResponse.json({ error: "Failed to fetch manager" }, { status: 500 });
  }
}
