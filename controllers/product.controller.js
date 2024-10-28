const Product = require("../models/product");
const mongoose = require("mongoose");

function store(req, res) {
  const imagePaths = req.files ? req.files.map((file) => file.path) : []; // get paths of all uploaded images

  const product = new Product({
    images: imagePaths,
    sku: req.body.sku,
    title: req.body.title,
    price: {
      base: req.body.base,
      discount: req.body.discount,
    },
    description: req.body.description,
    categoryId: req.body.categoryId,
    quantity: req.body.quantity,
    scent: req.body.scent,
    volume:req.body.volume,
    rating: req.body.rating,
    status: req.body.status,
})
  product
    .save()
    .then((product) => {
      res.status(201).json({
        message: "Product Created Successfully",
        method: "POST",
        url: "http://localhost:5000/products",
        createdProduct: product,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
}

function update(req, res) {
  const id = req.params.id;

  const updatedData = {
    sku: req.body.sku,
    title: req.body.title,
    price: {
      base: req.body.base,
      discount: req.body.discount,
    },
    description: req.body.description,
    images: req.files ? req.files.map((file) => file.path) : undefined, // Handle multiple images
    categoryId: req.body.categoryId || null,
    quantity: req.body.quantity,
    scent: req.body.scent,
    volume:req.body.volume,
    rating: req.body.rating,
    status: req.body.status,
  };

  Product.findByIdAndUpdate(id, updatedData, { new: true })
    .then((product) => {
      if (product.length === 0) {
        return res.status(404).json({
          message: "Product Not Found",
        });
      }
      res.status(200).json({
        message: "Product Updated Successfully",
        product: product,
      });
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Product ID" });
      } else {
        res.status(500).json({
          error: err,
        });
      }
    });
}

function show(req, res) {
  const id = req.params.id;
  Product.findById(id)
    .then((product) => {
      if (product.length === 0) {
        return res.status(404).json({
          message: "Product Not Found",
        });
      }
      res.status(200).json({
        message: "Product Retrieved Successfully",
        product: product,
      });
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Product ID" });
      } else {
        res.status(500).json({
          error: err,
        });
      }
    });
}

function index(req, res) {
  Product.find({})
    // .select('title _id images price rating')
    .then((products) => {
      if (products.length === 0) {
        res.status(404).json({
          message: "No Products Yet",
          method: "GET",
          statusCode: "404",
        });
      } else {
        res.status(200).json({
          message: "Products Retrieved Successfully",
          method: "GET",
          url: "http://localhost:5000/products",
          statusCode: "200",
          products: products.map((product) => {
            return {
              id: product._id,
              title: product.title,
              basePrice: product.price.base,
              discountPercentage: product.price.discount,
              rating: product.rating,
              quantity: product.quantity,
              scent: product.scent,
              volume: product.volume,
              rating: product.rating
            };
          }),
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

function destroy(req, res) {
  const id = req.params.id;

  Product.findByIdAndDelete(id)
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).json({
          message: "Product Not Found",
        });
      }
      res.status(200).json({
        message: "Product Deleted Successfully",
        deleteProduct: result,
      });
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Product ID" });
      } else {
        res.status(500).json({
          error: err,
        });
      }
    });
}

module.exports = {
  store,
  update,
  destroy,
  show,
  index,
};
