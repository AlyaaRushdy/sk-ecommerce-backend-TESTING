var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productsSchema = new Schema(
  {
    sku: { type: String, required: true },
    title: { type: String, required: true },
    price: {
      base: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      afterDiscount: { type: Number, required: false },
    },
    description: { type: String, required: false },
    images: [{ type: String, required: false }],
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    stock: { type: Number, required: true },
    scent: { type: String, required: false },
    volume: { type: String, required: false },
    gender: { type: String, required: false },
    rating: { type: Number, default: 0 },
    status: { type: String, default: "in-stock" },
  },

  { timestamps: true }
);

productsSchema.pre(["find", "findById", "save"], function (next) {
  if (this.stock == 0) {
    this.status = "out-of-stock";
  } else if (this.stock <= 10) {
    this.status = "low-stock";
  }
  next();
});

module.exports = mongoose.model("Product", productsSchema);
