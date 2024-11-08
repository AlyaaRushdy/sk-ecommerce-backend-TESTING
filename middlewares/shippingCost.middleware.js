const ShippingCost = require("../models/shippingCost");

function getShippingCostById(req, res, next) {
  const { id } = req.params;
  ShippingCost.findById(id)
    .populate("adminId", "email name")
    .then((shippingCost) => {
      if (shippingCost) {
        res.shippingCost = shippingCost;
        next();
      } else {
        return res.status(404).json({
          message: "Shipping cost not found!",
          method: req.method,
          url: req.originalUrl,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Server Error! please try again later",
        method: req.method,
        url: req.originalUrl,
        errorCode: err.code,
        errorMessage: err.message,
      });
    });
}

function getShippingCostByPlace(req, res, next) {
  ShippingCost.findOne({ place: req.body.place })
    .populate("adminId", "email name")
    .then((shippingCost) => {
      if (shippingCost) {
        res.shippingCost = shippingCost;
        next();
      } else {
        return res.status(404).json({
          message: "Shipping cost not found!",
          method: req.method,
          url: req.originalUrl,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Server error! please try again later.",
        method: req.method,
        url: req.originalUrl,
        errorCode: err.code,
        errorMessage: err.message,
      });
    });
}

module.exports = { getShippingCostById, getShippingCostByPlace };
