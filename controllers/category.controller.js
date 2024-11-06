const Category = require("../models/category");
const Product = require("../models/product");
const mongoose = require("mongoose");
const { uploadSingleImage } = require("../utils/imageUpload");

// Retrieve all categories
function index(req, res) {
  Category.find({})
    .then((categories) => {
      if (categories.length === 0) {
        res.status(404).json({
          message: "No Categories Yet",
          method: "GET",
          statusCode: "404",
        });
      } else {
        res.status(200).json({
          message: "Categories Retrieved Successfully",
          method: "GET",
          url: "http://localhost:5000/categories",
          statusCode: "200",
          categories: categories,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

// Retrieve a single category and related products
function show(req, res) {
  const id = req.params.id;
  Category.findById(id)
    .then((category) => {
      if (!category) {
        return res.status(404).json({
          message: "Category Not Found",
        });
      }

      // Find products related to this category
      Product.find({ categoryId: id })
        .then((products) => {
          res.status(200).json({
            message: "Category and Related Products Retrieved Successfully",
            category: category,
            products: products,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Category ID" });
      } else {
        res.status(500).json({
          error: err,
        });
      }
    });
}

// Retrieve a single category and related products
function getCategoryByCode(req, res) {
  const code = req.params.code;
  Category.findOne({ code: code })
    .then((category) => {
      if (!category) {
        return res.status(404).json({
          message: "Category Not Found",
        });
      }

      // Find products related to this category
      Product.find({ categoryId: category._id })
        .then((products) => {
          res.status(200).json({
            message: "Category and Related Products Retrieved Successfully",
            category: category,
            products: products,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Category ID" });
      } else {
        res.status(500).json({
          error: err,
        });
      }
    });
}

// Create a new category
async function store(req, res) {
  const { categoryTitle, description, stock, code } = req.body;

  if (!categoryTitle) {
    return res.status(400).json({
      message: "title is required",
    });
  } else if (!code) {
    return res.status(400).json({
      message: "code is required",
    });
  } else if (!req.file) {
    return res.status(400).json({
      message: "image is required",
    });
  }

  try {
    // Create a new category
    const newCategory = new Category({
      categoryTitle,
      description,
      imageUrl: req.file && (await uploadSingleImage(req.file, "categories")),
      stock,
      code,
      createdBy: res.adminId,
    });

    const savedCategory = await newCategory.save();

    return res.status(201).json({
      message: "Category Created Successfully",
      category: savedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
}

// Update a category and recalculate product stock and starting price
async function update(req, res) {
  const id = req.params.id;
  const { categoryTitle, description, code } = req.body;

  const category = await Category.findById(id)
    .then((category) => {
      if (!category) {
        return res.status(404).json({
          message: "Category Not Found",
        });
      } else return category;
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Category ID" });
      } else {
        res.status(500).json({ error: err });
      }
    });

  // Update product stock and starting price based on products in this category
  const productRelatedFields = await Product.find({ categoryId: id })
    .then((products) => {
      const totalStock = products.reduce(
        (total, product) => total + product.stock,
        0
      );
      const prices = products.map((product) => product.price.base);
      const startingPrice = prices.length
        ? `$${Math.min(...prices)} to $${Math.max(...prices)}`
        : "N/A";

      return { totalStock, startingPrice };
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });

  const updatedData = {
    categoryTitle,
    description,
    imageUrl: req.file && (await uploadSingleImage(req.file, "categories")),
    stock: productRelatedFields.totalStock,
    startingPrice: productRelatedFields.startingPrice,
    code,
  };

  Category.updateOne({ _id: category._id }, updatedData)
    .then(() => {
      return res.status(200).json({
        message: "Category Updated Successfully",
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// Delete a category
function destroy(req, res) {
  const id = req.params.id;

  Category.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "Category Not Found",
        });
      }
      res.status(200).json({
        message: "Category Deleted Successfully",
        deleteCategory: result,
      });
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Category ID" });
      } else {
        res.status(500).json({ error: err });
      }
    });
}

module.exports = {
  show,
  index,
  store,
  update,
  destroy,
  getCategoryByCode,
};
