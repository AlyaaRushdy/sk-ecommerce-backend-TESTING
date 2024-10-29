const User = require("../models/user");
const multer = require("multer");
const path = require("path");

function getUserById(req, res, next) {
  const { id } = req.params;
  User.findById(id)
    .select(
      "fname lname email birthDay gender phone address profileImage latestOrderId lastLoginDate accountStatus createdAt"
    )
    .then((user) => {
      if (user) {
        res.user = user;
        next();
      } else {
        return res.status(404).json({
          message: "User not Found!",
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

function getUserByEmail(req, res, next) {
  User.findOne({ email: req.body.email })
    .select(
      "fname lname email birthDay gender address phone profileImage latestOrderId lastLoginDate accountStatus"
    )
    .then((user) => {
      if (user) {
        res.user = user;
        next();
      } else {
        return res.status(404).json({
          message: "User not Found!",
          method: req.method,
          url: req.originalUrl,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Server error! please try again later.",
        method: req.method,
        url: req.originalUrl,
        errorCode: err.code,
        errorMessage: err.message,
      });
    });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") +
        file.originalname.replace(/ /g, "_")
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/png" || file.mimetype == "image/jpg") {
    cb(null, true);
  } else {
    cb(Error("unsupported extention"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = { getUserById, getUserByEmail, upload };
