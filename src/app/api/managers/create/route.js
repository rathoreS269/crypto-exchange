import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Manager from "@/models/Manager";

export async function POST(req) {
  try {
    await dbConnect();
    console.log("✅ Database Connected");

    const { username, password } = await req.json();
    console.log("📌 Data received:", { username, password });

    if (!username || !password) {
      return NextResponse.json({ message: "Username & Password required" }, { status: 400 });
    }

    const newManager = new Manager({ username, password });
    await newManager.save();
    console.log("🎉 Manager created:", newManager);

    return NextResponse.json({ message: "Manager created successfully", manager: newManager });
  } catch (error) {
    console.error("❌ Error creating manager:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
