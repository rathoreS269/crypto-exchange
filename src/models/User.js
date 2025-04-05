import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  walletBalance: { type: Number, default: 0 },
  // ownedProducts: [{ type: String }], // Storing product IDs from the API
  ownedProducts: [
    {
      productId: String,  // Product ID from API
      name: String,       // Product Name
      price: Number,      // Latest price of product
      goodUnits: { type: Number, default: 0 }, // Held Good units
      badUnits: { type: Number, default: 0 }   // Held Bad units
    }
  ],
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "Manager" } // User belongs to a manager
});

// Prevent OverwriteModelError
export default mongoose.models.User || mongoose.model("User", userSchema);
