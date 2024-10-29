const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const order = new Schema(
  {
    cart: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    shipping: {
      type: Schema.Types.ObjectId,
      ref: "ShippingCost",
      required: true,
    },
    status: { type: String, default: "Under testing" },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1, min: 1 },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", order);
