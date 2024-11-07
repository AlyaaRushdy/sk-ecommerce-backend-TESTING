require("dotenv").config();
const jwt = require("jsonwebtoken");

function generateUserToken(user) {
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.AUTH_SECRET
  );

  return token;
}
function generateAdminToken(admin) {
  const token = jwt.sign(
    { adminId: admin._id, role: admin.role },
    process.env.AUTH_SECRET
  );

  return token;
}

module.exports = { generateAdminToken, generateUserToken };
