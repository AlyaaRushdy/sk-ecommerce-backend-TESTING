const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: {
        type: String,
        required: true,
      },
      details: {
        cardBrand: {
          type: String,
          required: true,
        },
        lastFour: {
          type: String,
          required: true,
        },
        expirationMonth: {
          type: Number,
          required: true,
        },
        expirationYear: {
          type: Number,
          required: true,
        },
        cvvVerified: {
          type: Boolean,
          required: true,
        },
        required: true,
      },
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
