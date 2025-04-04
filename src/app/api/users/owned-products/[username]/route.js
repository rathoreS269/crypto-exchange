import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req, context) {
  try {
    await dbConnect();
    const { username } = context.params;

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ ownedProducts: user.ownedProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching owned products:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
