const Category = require("../models/category");
const Product = require("../models/product"); 
const Admin = require('../models/admin')
const mongoose = require("mongoose");

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

// Create a new category
async function store(req, res) {
  const { categoryTitle, description ,stock , createdBy} = req.body;
  const imageUrl = req.files.map((file) => file.path);
  try {
    // Create a new category
    const newCategory = new Category({
      categoryTitle,
      description,
      imageUrl,
      stock,
      createdBy,
    });

    const savedCategory = await newCategory.save()
    .then((category)=>{
      console.log(category);
    }).catch((err) =>{
      console.error(err);
    })
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
function update(req, res) {
  const id = req.params.id;
  const { categoryTitle, description, stock, createdBy } = req.body; // Use categoryTitle

  const updatedData = {
    categoryTitle: categoryTitle, // Fixed field name
    description: description,
    stock: stock, // Include stock if it's meant to be updated
    createdBy: createdBy, // Include createdBy if it's meant to be updated
    imageUrl: req.files.map((file) => file.path), // Handle uploaded images
  };

  Category.findByIdAndUpdate(id, updatedData, { new: true })
    .then((category) => {
      if (!category) {
        return res.status(404).json({
          message: "Category Not Found",
        });
      }

      // Update product stock and starting price based on products in this category
      Product.find({ categoryId: id })
        .then((products) => {
          const totalStock = products.reduce(
            (total, product) => total + product.quantity,
            0
          );
          const prices = products.map((product) => product.price.base);
          const startingPrice = prices.length
            ? `$${Math.min(...prices)} to $${Math.max(...prices)}`
            : "N/A";

          category.productStock = totalStock;
          category.startingPrice = startingPrice;

          category.save().then((updatedCategory) => {
            res.status(200).json({
              message: "Category Updated Successfully",
              category: updatedCategory,
            });
          });
        })
        .catch((err) => {
          res.status(500).json({ error: err });
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
};
