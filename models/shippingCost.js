const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shippingCostSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    place: { type: String, required: true, unique: true, lowercase: true },
    cost: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShippingCost", shippingCostSchema);
