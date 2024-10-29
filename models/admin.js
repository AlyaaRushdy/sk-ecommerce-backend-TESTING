const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, immutable: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    lastLoginDate: { type: Date },
    accountStatus: { type: String, default: "active" },
    role: { type: String, default: "admin" },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
