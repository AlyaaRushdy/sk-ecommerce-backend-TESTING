require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateUserToken(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.AUTH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          message: "Forbidden Access!",
        });
      } else if (user.userId) {
        res.userId = user.userId;
        res.role = user.role;
        next();
      } else {
        return res.status(403).json({
          message: "Forbidden Access! you're not a user",
        });
      }
    });
  } else {
    return res.status(401).json({
      message: "Forbidden access! please login first",
    });
  }
}

function authenticateAdminToken(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.AUTH_SECRET, (err, admin) => {
      if (err || !admin.adminId) {
        return res.status(403).json({
          message: "Forbidden Access!",
        });
      } else if (admin.adminId) {
        res.adminId = admin.adminId;
        res.role = admin.role;
        next();
      } else {
        return res.status(403).json({
          message: "Forbidden Access! you're not an Admin",
        });
      }
    });
  } else {
    return res.status(401).json({
      message: "Forbidden access! please login first",
    });
  }
}

module.exports = { authenticateUserToken, authenticateAdminToken };
