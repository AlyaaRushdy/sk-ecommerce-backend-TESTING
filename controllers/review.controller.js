const Review = require("../models/review");
const mongoose = require("mongoose");

function store(req, res) {
  if (!req.body) {
    return res.status(400).json({ message: "Request body cannot be empty." });
  }

  const { productId, customerId, rating, comment } = req.body;

  if (!productId || !rating) {
    return res.status(400).json({
      message: "productId and rating are required.",
    });
  }
  const newReview = new Review({
    productId,
    customerId,
    rating,
    comment,
  });

  // Save the review to the database
  newReview
    .save()
    .then((review) => {
      res.status(201).json({
        message: "Review created successfully",
        url: "http://localhost:5000/reviews",
        method: "POST",
        review: review,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
}

function index(req, res) {
  Review.find({})
    // .select('title _id')
    .then((reviews) => {
      if (reviews.length===0) {
        res.status(404).json({
          message: "No reviews Yet",
          method: "GET",
          statusCode: "404",
        });
      } else {
        res.status(200).json({
          message: "reviews Retrieved Successfully",
          method: "GET",
          url: "http://localhost:5000/reviews",
          statusCode: "200",
          reviews: reviews,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

function show(req, res) {
  const id = req.params.id;
  Review.findById(id)
    .then((review) => {
      if (review.length===0) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.status(200).json({
        message: "Review Retrieved successfully",
        review: review,
      });
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Review ID" });
      } else {
        res.status(500).json({
          error: err,
        });
      }
    });
}




function getByProductId(req, res) {
  const { productId } = req.params;
  Review.find({ productId })
    .then((reviews) => {
      if (reviews.length===0) {
        return res.status(404).json({
          message: "No reviews found for this product.",
          method: "GET",
          statusCode: 404,
        });
      }
      res.status(200).json({
        message: "Reviews retrieved successfully",
        reviews: reviews,
      });
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid Product ID" });
      } else {
        res.status(500).json({
          error: err,
        });
      }
    });
}

function update(req, res) {
  const id = req.params.id;
  const updatedData = {
    rating: "",
    comment: "",
  };

  for (const key in updatedData) {
    updatedData[key] = req.body[key];
  }

  Review.findByIdAndUpdate(id, updatedData, { new: true })
    .then((review) => {
      if (review.length===0) {
        res.status(404).json({
          message: "Review Not Found",
        });
      }
      res.status(200).json({
        message: "Review Updated Successfully",
        review: review,
      });
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Review ID" });
      } else {
        res.status(500).json({
          error: err,
        });
      }
    });
}

function destroy(req, res) {
  const id = req.params.id;

  Review.findByIdAndDelete(id)
    .then((result) => {
      if (result.length===0) {
        res.status(404).json({ message: "Review Not Found" });
      }
      res.status(200).json({
        message: "Review Deleted Successfully",
        deleteReview: result,
      });
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: " Invalid Review ID" });
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
  index,
  show,
  getByProductId,
};
