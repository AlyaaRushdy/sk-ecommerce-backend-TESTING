const Product = require("../models/product");
const mongoose = require("mongoose");

const priceAfterDiscount = (originalPrice, discount) => {
  if (discount) {
    const discountedAmount = (originalPrice * discount) / 100;
    return originalPrice - discountedAmount;
  }
  return originalPrice;
};

const stockStatus = (quantity) => {
  if (quantity == 0) {
    return "out-of-stock";
  } else if (quantity <= 10) {
    return "low-stock";
  } else return "in-stock";
};

function store(req, res) {
  const imagePaths = req.files ? req.files.map((file) => file.path) : []; // get paths of all uploaded images

  const product = new Product({
    images: imagePaths,
    sku: req.body.sku,
    title: req.body.title,
    price: {
      base: req.body.base,
      discount: req.body.discount,
      afterDiscount: priceAfterDiscount(req.body.base, req.body.discount),
    },
    description: req.body.description,
    categoryId: req.body.categoryId,
    stock: req.body.stock,
    scent: req.body.scent,
    volume: req.body.volume,
  });
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

async function update(req, res) {
  const id = req.params.id;
  const imagePaths = req.files ? req.files.map((file) => file.path) : []; // get paths of all uploaded images

  const product = await Product.findById(id)
    .then(res)
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });

  if (product) {
    const afterDiscount = () => {
      if (!req.body.base && !req.body.discount)
        return product.price.afterDiscount;
      else if (req.body.base && !req.body.discount)
        return priceAfterDiscount(req.body.base, product.price.discount);
      else if (!req.body.base && req.body.discount)
        return priceAfterDiscount(product.price.base, req.body.discount);
      else return priceAfterDiscount(req.body.base, req.body.discount);
    };

    const updatedData = {
      images: imagePaths,
      sku: req.body.sku,
      title: req.body.title,
      price: {
        base: req.body.base || product.price.base,
        discount: req.body.discount || product.price.discount,
        afterDiscount: afterDiscount(),
      },
      description: req.body.description,
      categoryId: req.body.categoryId,
      stock: req.body.stock || product.stock,
      scent: req.body.scent,
      volume: req.body.volume,
      status: stockStatus(req.body.stock),
    };

    Product.updateOne({ _id: id }, updatedData)
      .then(() => {
        res.status(200).json({
          message: "Product Updated Successfully",
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
  } else {
    return res.status(404).json({
      message: "product not found",
    });
  }
}

function show(req, res) {
  const id = req.params.id;
  Product.findById(id)
    .then((product) => {
      if (!product) {
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
    .populate("categoryId", "categoryTitle _id")
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
              sku: product.sku,
              title: product.title,
              basePrice: product.price.base,
              priceAfterDiscount: product.price.afterDiscount,
              discountPercentage: product.price.discount,
              image: product.images[0],
              stock: product.stock,
              status: product.status,
              categoryId: product.categoryId._id,
              categoryTitle: product.categoryId.categoryTitle,
              scent: product.scent,
              volume: product.volume,
              rating: product.rating,
              createdAt: product.createdAt,
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
