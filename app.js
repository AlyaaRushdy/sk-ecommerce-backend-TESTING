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

//routing

module.exports = app;
