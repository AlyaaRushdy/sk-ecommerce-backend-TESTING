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

// middlewares

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());


//routing
app.use("/products", require("./routes/product.routes"));

module.exports = app;
