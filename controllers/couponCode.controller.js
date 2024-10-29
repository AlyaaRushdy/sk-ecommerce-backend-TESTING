const CouponCode = require("../models/couponCode");
const mongoose = require("mongoose");

// Get all coupon codes with pagination
async function index(req, res) {
  const { page = 1, limit = 10 } = req.query;

  try {
    const couponCodes = await CouponCode.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalItems = await CouponCode.countDocuments();

    res.status(200).json({
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      couponCodes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get a single coupon code by ID
async function show(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid coupon code ID" });
  }

  try {
    const couponCode = await CouponCode.findById(id);
    if (!couponCode)
      return res.status(404).json({ message: "Coupon code not found" });
    res.status(200).json(couponCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Create a new coupon code
async function store(req, res) {
  const { name, discount, startDate, endDate } = req.body;
  console.log("req.body: ", req.body);

  if (!name || !discount || !startDate || !endDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const couponCode = new CouponCode({
      name,
      discount,
      startDate,
      endDate,
    });
    couponCode
      .save()
      .then((cp) => {
        return res.status(201).json(cp);
      })
      .catch((error) => {
        return res.status(500).json({ error: error.message });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a coupon code
async function update(req, res) {
  const { id } = req.params;
  const { name, discount, startDate, endDate } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid coupon code ID" });
  }

  try {
    const couponCode = await CouponCode.findById(id);
    if (!couponCode)
      return res.status(404).json({ message: "Coupon code not found" });

    couponCode.name = name || couponCode.name;
    couponCode.discount = discount || couponCode.discount;
    couponCode.startDate = startDate || couponCode.startDate;
    couponCode.endDate = endDate || couponCode.endDate;

    await couponCode.save();
    res.status(200).json(couponCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete a coupon code
async function destroy(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid coupon code ID" });
  }

  try {
    const couponCode = await CouponCode.findByIdAndDelete(id);
    if (!couponCode)
      return res.status(404).json({ message: "Coupon code not found" });
    res.status(200).json({ message: "Coupon code deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  store,
  show,
  index,
  update,
  destroy,
};
