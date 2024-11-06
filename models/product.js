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
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock: { type: Number, required: true },
    scent: { type: String, required: false },
    volume: { type: String, required: false },
    gender: { type: String, required: false },
    rating: { type: Number, default: 0 },
    status: { type: String, default: "in-stock" },
    ingredients: [{ type: String, required: true }],
    using: [{ type: String, required: true }],
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

productsSchema.set("toJSON", {
  transform: function (document, returnedObj) {
    return {
      id: returnedObj._id,
      sku: returnedObj.sku,
      title: returnedObj.title,
      description: returnedObj.description,
      basePrice: returnedObj.price.base,
      priceAfterDiscount: returnedObj.price.afterDiscount,
      discountPercentage: returnedObj.price.discount,
      images: returnedObj.images,
      stock: returnedObj.stock,
      status: returnedObj.status,
      categoryId: returnedObj.categoryId._id,
      categoryTitle: returnedObj.categoryId.categoryTitle,
      scent: returnedObj.scent,
      volume: returnedObj.volume,
      rating: returnedObj.rating,
      ingredients: returnedObj.ingredients,
      using: returnedObj.using,
      gender: returnedObj.gender,
      createdAt: returnedObj.createdAt,
      updatedAt: returnedObj.updatedAt,
    };
  },
});

module.exports = mongoose.model("Product", productsSchema);
