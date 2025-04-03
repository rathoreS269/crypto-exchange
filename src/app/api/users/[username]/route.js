import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { username } = params;

      // Fetch user and populate ownedProducts & manager's username only
      const user = await User.findOne({ username })
      .populate("ownedProducts")
      .populate("manager", "username");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
