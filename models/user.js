const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true, immutable: true },
    password: { type: String, required: true },
    birthDay: { type: Date },
    gander: { type: String },
    address: [
      {
        street1: { type: String, required: true },
        street2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
      },
    ],
    phone: { type: String, required: true, unique: true },
    profileImage: { type: String },
    favourites: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    latestOrderId: { type: Schema.Types.ObjectId, ref: "Order" },
    lastLoginDate: { type: Date },
    role: { type: String, default: "user", immutable: true },
    accountStatus: { type: String, default: "active" },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
