require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateUserToken(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.AUTH_SECRET, (err, user) => {
      // console.log(user);
      if (err) {
        return res.status(403).json({
          message: "Forbidden Access!",
        });
      } else {
        res.userId = user.userId;
        next();
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
      } else {
        res.adminId = admin.adminId;
        res.role = admin.role;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: "Forbidden access! please login first",
    });
  }
}

module.exports = { authenticateUserToken, authenticateAdminToken };
