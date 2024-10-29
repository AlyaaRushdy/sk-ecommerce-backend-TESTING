const Admin = require("../models/admin");
const multer = require("multer");
const path = require("path");

function getAdminById(req, res, next) {
  const { id } = req.params;
  Admin.findById(id)
    .select("name email profileImage lastLoginDate accountStatus")
    .then((admin) => {
      if (admin) {
        res.admin = admin;
        next();
      } else {
        return res.status(404).json({
          message: "Admin not Found!",
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

function getAdminByEmail(req, res, next) {
  Admin.findOne({ email: req.body.email })
    .select("name email profileImage lastLoginDate accountStatus")
    .then((admin) => {
      if (admin) {
        res.admin = admin;
        next();
      } else {
        return res.status(404).json({
          message: "Admin not Found!",
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

module.exports = { getAdminById, getAdminByEmail, upload };
