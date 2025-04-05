import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { username, productId, name, price, quantity, type } = body;

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const totalCost = price * quantity;
    if (user.walletBalance < price) {
      return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
    }

    const existingProductIndex = user.ownedProducts.findIndex(p => p.productId === productId);

    if (existingProductIndex !== -1) {
      // Update units and latest price
      if (type === "good") {
        user.ownedProducts[existingProductIndex].goodUnits += quantity;
      } else {
        user.ownedProducts[existingProductIndex].badUnits += quantity;
      }
      user.ownedProducts[existingProductIndex].price = price;
    } else {
      // New product add
      user.ownedProducts.push({
        productId,
        name,
        price,
        goodUnits: type === "good" ? quantity : 0,
        badUnits: type === "bad" ? quantity : 0,
      });
    }

    // Deduct price from wallet
    // user.walletBalance -= price;
    user.walletBalance -= totalCost;

    await user.save();

    return NextResponse.json({ message: "Product purchased successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error purchasing product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
