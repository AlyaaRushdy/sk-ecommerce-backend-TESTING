const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shippingCostSchema = new Schema(
  {
    place: { type: String, required: true, unique: true, lowercase: true },
    cost: { type: Number, required: true },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

shippingCostSchema.set("toJSON", {
  transform: function (doc, returnedObj) {
    return {
      shippingId: returnedObj._id,
      place: returnedObj.place,
      cost: returnedObj.cost,
      addedBy: returnedObj.adminId,
      createdAt: returnedObj.createdAt,
      updatedAt: returnedObj.updatedAt,
      __v: returnedObj.__v,
    };
  },
});

module.exports = mongoose.model("ShippingCost", shippingCostSchema);
