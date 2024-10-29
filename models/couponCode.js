const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponCodeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    discountStatus: { type: String, default: "active" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

couponCodeSchema.pre(["find", "findOne", "findById", "save"], function (next) {
  if (new Date() > this.endDate) {
    this.discountStatus = "expired";
  }
  next();
});

couponCodeSchema.pre(["find", "findOne", "findById", "save"], function (next) {
  if (new Date() < this.startDate) {
    this.discountStatus = "pending";
  }
  next();
});

module.exports = mongoose.model("CouponCode", couponCodeSchema);
