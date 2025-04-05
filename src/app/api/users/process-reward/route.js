// /app/api/users/process-reward/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();

  try {
    const { username, productStatusMap } = await req.json(); // status from frontend

    const user = await User.findOne({ username });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let walletUpdate = 0;
    const updatedOwnedProducts = [];

    for (const product of user.ownedProducts) {
      const { productId, price, goodUnits, badUnits } = product;
      const status = productStatusMap[productId]; // status should be "good" or "bad"

      if (!status) {
        updatedOwnedProducts.push(product); // keep unprocessed
        continue;
      }

      const totalGood = goodUnits * price * 0.1;
      const totalBad = badUnits * price * 0.1;

      let isProcessed = false;

      // ✅ Process reward/loss
      if (status === "good" && goodUnits > 0) {
        walletUpdate += totalGood;
        isProcessed = true;
      }

      if (status === "bad" && badUnits > 0) {
        walletUpdate -= totalBad;
        isProcessed = true;
      }

      // ✅ Only keep unprocessed products
      if (!isProcessed) {
        updatedOwnedProducts.push(product);
      }
    }

    // ✅ Update wallet and products
    user.walletBalance += walletUpdate;
    user.ownedProducts = updatedOwnedProducts;
    await user.save();

    return NextResponse.json({
      message: "Reward/Loss processed",
      walletUpdate,
      updatedBalance: user.walletBalance,
    });
  } catch (err) {
    console.error("Process Reward Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
