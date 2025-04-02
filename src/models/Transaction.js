import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  from: String, // Sender (Admin/Manager/User)
  to: String, // Receiver
  amount: Number,
  type: { type: String, enum: ["assigned", "purchase"] }, // 'assigned' for coin transfer, 'purchase' for buying
  date: { type: Date, default: Date.now }
});

// Prevent OverwriteModelError
export default mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);


  