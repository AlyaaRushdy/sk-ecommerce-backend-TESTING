const Admin = require("../models/admin");

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

module.exports = { getAdminById, getAdminByEmail };
