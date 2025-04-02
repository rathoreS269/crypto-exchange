import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
  username: String,
  password: String,
  coinsAssigned: { type: Number, default: 0 }, // Coins received from Admin
  coinsUsed: { type: Number, default: 0 }, // Coins given to users
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Users under this manager
});

// Prevent OverwriteModelError
export default mongoose.models.Manager || mongoose.model("Manager", managerSchema);
