require("dotenv").config();

const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function index(req, res) {
  // if (res.role == "owner") {
  Admin.find({})
    .select(
      "name email role accountStatus createdAt updatedAt lastLoginDate _id"
    )
    .then((admins) => {
      if (admins.length > 0) {
        return res.status(200).json({
          message: "Admins retrieved successfully!",
          method: req.method,
          url: req.originalUrl,
          total: admins.length,
          admins: admins,
        });
      } else {
        return res.status(404).json({
          message: "No admins yet!",
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
  // } else {
  //   return res.status(403).json({
  //     message: "You're not authorized to make this change!",
  //     method: req.method,
  //     url: req.originalUrl,
  //   });
  // }
}

function show(req, res) {
  // if (res.role == "owner") {
  return res.status(200).json({
    message: "admin retrieved successfully!",
    method: req.method,
    url: req.originalUrl,
    admin: res.admin,
  });
  // } else {
  //   return res.status(403).json({
  //     message: "You're not authorized to make this change!",
  //     method: req.method,
  //     url: req.originalUrl,
  //   });
  // }
}

function addNewAdmin(req, res) {
  // if (res.role == "owner") {
  const { email, password, name } = req.body;
  console.log(req.body);
  console.log("name: ", name);
  console.log("email: ", email);
  console.log("password: ", password);

  if (!password || !email || !name) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  bcrypt.hash(password, 10).then((hashedPassword) => {
    const admin = new Admin({
      email: email,
      name: name,
      password: hashedPassword,
    });

    admin
      .save()
      .then(() => {
        return res.status(201).json({
          message: "Admin Registered Successfully",
        });
      })
      .catch((err) => {
        if (err.code == 11000) {
          return res.status(409).json({
            message: "email already exists, try loging in instead",
            errorCode: err.code,
            errorMessage: err.message,
          });
        }
        return res.status(500).json({
          message: "server error",
          errorCode: err.code,
          errorMessage: err.message,
        });
      });
  });
  // } else {
  //   return res.status(403).json({
  //     message: "You're not authorized to make this change!",
  //     method: req.method,
  //     url: req.originalUrl,
  //   });
  // }
}

function createOwner(req, res) {
  const { email, password, name } = req.body;

  if (!password || !email || !name) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  bcrypt.hash(password, 10).then((hashedPassword) => {
    const admin = new Admin({
      email: email,
      name: name,
      role: "owner",
      password: hashedPassword,
    });

    admin
      .save()
      .then(() => {
        return res.status(201).json({
          message: "Owner Created Successfully",
        });
      })
      .catch((err) => {
        if (err.code == 11000) {
          return res.status(409).json({
            message: "email already exists, try loging in instead",
            errorCode: err.code,
            errorMessage: err.message,
          });
        }
        return res.status(500).json({
          message: "server error",
          errorCode: err.code,
          errorMessage: err.message,
        });
      });
  });
}

function updateData(req, res) {
  if (res.admin._id == res.adminId) {
    const { name } = req.body;
    const profileImage = req.file?.path;

    const adminFields = { name, profileImage };

    Object.keys(adminFields).forEach(
      (key) => adminFields[key] === undefined && delete adminFields[key]
    );

    if (Object.keys(adminFields).length == 0) {
      return res.status(400).json({
        message: "no data provided.. please add the data you want to add",
      });
    }

    Admin.updateOne(res.admin, adminFields).then(() => {
      return res.status(200).json({
        message: "Admin Updated Successfully",
      });
    });
  } else {
    return res.status(403).json({
      message: "You're not authorized to make this change!",
      method: req.method,
      url: req.originalUrl,
    });
  }
}

function setStatusToDeleted(req, res) {
  if (res.role == "owner") {
    if (res.admin.accountStatus == "active") {
      Admin.updateOne(res.admin, { accountStatus: "deleted" }).then(() => {
        return res.status(200).json({
          message: "Admin account status set to deleted successfully",
        });
      });
    } else {
      Admin.updateOne(res.admin, { accountStatus: "active" }).then(() => {
        return res.status(200).json({
          message: "Admin account status set to deleted successfully",
        });
      });
    }
  } else {
    return res.status(403).json({
      message: "You're not authorized to make this change!",
      method: req.method,
      url: req.originalUrl,
    });
  }
}

async function changePassword(req, res) {
  // if (res.admin._id == res.adminId) {
  const { oldPassword, newPassword } = req.body;
  const adminPassword = await Admin.findOne({ _id: res.adminId }).then(
    (admin) => admin.password
  );

  bcrypt
    .compare(oldPassword, adminPassword)
    .then((isIdentical) => {
      if (isIdentical) {
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        Admin.updateOne(
          { _id: res.adminId },
          { password: hashedPassword }
        ).then(() => {
          res.status(201).json({
            message: "Password updated successfully!",
          });
        });
      } else {
        res.status(400).json({
          message: "Your old password is incorrect!",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        message: "please provide the old and the new password!",
        errorCode: err.code,
        errorMessage: err.message,
      });
    });
  // } else {
  //   return res.status(403).json({
  //     message: "You're not authorized to make this change!",
  //     method: req.method,
  //     url: req.originalUrl,
  //   });
  // }
}

async function login(req, res) {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email });

  if (!admin) {
    return res.status(400).json({
      message: "Wrong email or password",
    });
  }

  if (admin.accountStatus == "deleted") {
    return res.status(403).json({
      message: "Forbidden access... your account is deleted",
    });
  } else {
    bcrypt
      .compare(password, admin.password)
      .then((isIdentical) => {
        if (isIdentical) {
          const token = jwt.sign(
            { adminId: admin._id, role: admin.role },
            process.env.AUTH_SECRET
          );

          Admin.updateOne(
            { _id: admin._id },
            { lastLoginDate: new Date() }
          ).catch((err) => {
            return res.status(500).json({
              message: `something went wrong!`,
              errorCode: err.code,
              errorMessage: err.message,
            });
          });

          res.header("Authorization", `Bearer ${token}`);
          res.status(200).json({
            message: `Welcome Back ${admin.name}!`,
          });
        } else {
          return res.status(400).json({
            message: "Wrong email or password",
          });
        }
      })
      .catch((err) => {
        return res.status(400).json({
          message: "please provide the email and password!",
          errorCode: err.code,
          errorMessage: err.message,
        });
      });
  }
}

// function signout(req, res) {
//   const { email, password } = req.body;
// }

module.exports = {
  index,
  show,
  addNewAdmin,
  createOwner,
  updateData,
  setStatusToDeleted,
  changePassword,
  login,
  // signout,
};
