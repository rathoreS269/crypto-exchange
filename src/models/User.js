import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  walletBalance: { type: Number, default: 0 },
  ownedProducts: [{ type: String }], // Storing product IDs from the API
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "Manager" } // User belongs to a manager
});

// Prevent OverwriteModelError
export default mongoose.models.User || mongoose.model("User", userSchema);
