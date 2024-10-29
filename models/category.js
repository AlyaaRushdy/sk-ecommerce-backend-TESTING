const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    categoryTitle: { type: String, required: true },
    description: { type: String, required: false },
    imageUrl: [
      { type: String, required: false }], 
    stock: { type: Number, default: 0 }, 
    startingPrice: { type: String, required: false },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
