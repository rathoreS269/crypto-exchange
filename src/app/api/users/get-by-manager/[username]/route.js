import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Manager from "@/models/Manager"; // ✅ Manager Model bhi import karo

export async function GET(req, { params }) {
    await dbConnect()
  const username = params?.username;
  
  if (!username) {
    return NextResponse.json({ error: "Manager username is required" }, { status: 400 });
  }

  try {
    console.log("Fetching manager for username:", username);
    const manager = await Manager.findOne({ username });
  
    if (!manager) {
      console.log("Manager not found!");
      return NextResponse.json({ error: "Manager not found" }, { status: 404 });
    }
  
    console.log("Manager found:", manager);
    const users = await User.find({ manager: manager._id });
  
    console.log("Users fetched:", users);
  
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
  
}
