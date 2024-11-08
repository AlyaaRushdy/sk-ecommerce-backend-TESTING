const ShippingCost = require("../models/shippingCost");
const Admin = require("../models/admin");

function index(req, res) {
  ShippingCost.find({})
    .populate("adminId", "name email")
    .then((results) => {
      if (results.length > 0) {
        return res.status(200).json({
          message: "Shipping costs retrieved successfully!",
          method: req.method,
          url: req.originalUrl,
          total: results.length,
          results: results,
        });
      } else {
        res.status(404).json({
          message: "No data found!",
          method: req.method,
          url: req.originalUrl,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Server Error! please try again later",
        method: req.method,
        url: req.originalUrl,
        errorCode: err.code,
        errorMessage: err.message,
      });
    });
}

function show(req, res) {
  return res.status(200).json({
    message: "shipping cost retrieved successfully!",
    method: req.method,
    url: req.originalUrl,
    results: res.shippingCost,
  });
}

function update(req, res) {
  const shippingCost = {
    place: "",
    cost: 0,
  };

  for (const key in shippingCost) {
    if (req.body[key]) {
      shippingCost[key] = req.body[key];
    } else {
      shippingCost[key] = res.shippingCost[key];
    }
  }

  ShippingCost.updateOne(res.shippingCost, {
    shippingCost,
    $inc: { __v: 1 },
  }).then(() => {
    res.status(200).json({
      message: "shipping Cost updated successfully!",
      method: req.method,
      url: req.originalUrl,
    });
  });
}

async function store(req, res) {
  const { adminId, place, cost } = req.body;

  await Admin.findById(adminId).then((admin) => {
    if (!admin) {
      return res.status(404).json({ message: "Admin Not Found" });
    }
  });

  const shippingCost = new ShippingCost({
    adminId,
    place,
    cost,
  });

  shippingCost
    .save()
    .then(shippingCost.populate("adminId", "name email"))
    .then((shippingCost) => {
      return res.status(201).json({
        message: "shipping cost added successfully!",
        method: req.method,
        url: req.originalUrl,
        savedShippingCost: shippingCost,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Server Error! please try again later",
        method: req.method,
        url: req.originalUrl,
        errorCode: err.code,
        errorMessage: err.message,
      });
    });
}

function destroy(req, res) {
  ShippingCost.deleteOne(res.shippingCost).then(() => {
    return res.status(200).json({
      message: "shipping cost deleted successfully!",
      method: req.method,
      url: req.originalUrl,
      deletedDate: res.shippingCost,
    });
  });
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
