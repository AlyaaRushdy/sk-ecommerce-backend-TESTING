require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

//database connection
mongoose.connect(process.env.DB_URL);
const conn = mongoose.connection;
conn.once("open", () => console.log(`Database Connected Successfully`));
conn.on("error", (err) => console.log("connection failed", err.message));

const corsOptions = {
  credentials: true,
  exposedHeaders: ["Authorization"],
  allowedHeaders: ["Authorization", "Content-Type"],
  methods: ["PUT", "POST", "GET", "DELETE", "OPTIONS"],
};

// middlewares
app.use(express.json());
app.use(cors(corsOptions)); // Enable CORS

//routing
app.use("/admins", require("./routes/admins.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/carts", require("./routes/carts.routes"));
app.use("/coupons", require("./routes/coupon.routes"));
app.use("/orders", require("./routes/order.routes"));
app.use("/shippingCosts", require("./routes/shippingCost.routes"));
app.use("/products", require("./routes/product.routes"));
app.use("/categories", require("./routes/category.routes"));
app.use("/reviews", require("./routes/review.routes"));

module.exports = app;
