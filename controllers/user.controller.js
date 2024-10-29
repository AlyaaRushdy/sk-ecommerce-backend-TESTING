require("dotenv").config();

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function index(req, res) {
  User.find({})
    .select(
      "fname lname email birthDay gender address phone profileImage latestOrderId lastLoginDate accountStatus createdAt"
    )
    .then((users) => {
      if (users.length > 0) {
        return res.status(200).json({
          message: "Users retrieved successfully!",
          method: req.method,
          url: req.originalUrl,
          total: users.length,
          users: users.map((user) => {
            return {
              id: user._id,
              fname: user.fname,
              lname: user.lname,
              fullName: `${user.fname} ${user.lname}`,
              email: user.email,
              birthDay: user.birthDay,
              gender: user.gender,
              address: user.address,
              phone: user.phone,
              profileImage: user.profileImage,
              latestOrderId: user.latestOrderId,
              lastLoginDate: user.lastLoginDate,
              accountStatus: user.accountStatus,
              createdAt: user.createdAt,
            };
          }),
        });
      } else {
        return res.status(404).json({
          message: "No users yet!",
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

function show(req, res) {
  return res.status(200).json({
    message: "user retrieved successfully!",
    method: req.method,
    url: req.originalUrl,
    user: res.user,
  });
}

function register(req, res) {
  const { fname, lname, phone, email, password } = req.body;

  if (!fname || !lname || !phone || !password || !email) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  bcrypt.hash(password, 10).then((hashedPassword) => {
    const user = new User({
      fname: fname,
      lname: lname,
      email: email,
      phone: phone,
      password: hashedPassword,
    });

    user
      .save()
      .then(() => {
        return res.status(201).json({
          message: "User Registered Successfully",
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
  if (res.user._id == res.userId) {
    const { fname, lname, birthDay, gender, address, phone } = req.body;
    const profileImage = req.file?.path;

    const userFields = {
      fname,
      lname,
      birthDay,
      gender,
      address,
      phone,
      profileImage,
    };

    Object.keys(userFields).forEach(
      (key) => userFields[key] === undefined && delete userFields[key]
    );

    if (Object.keys(userFields).length == 0) {
      return res.status(400).json({
        message: "no data provided.. please add the data you want to add",
      });
    }

    User.updateOne(res.user, userFields).then(() => {
      return res.status(200).json({
        message: "User Updated Successfully",
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

function setStatusToBanned(req, res) {
  if (res.adminId) {
    if (res.user.accountStatus == "active") {
      User.updateOne(res.user, { accountStatus: "banned" }).then(() => {
        // index(req, res);
        return res.status(200).json({
          message: "User account status set to banned successfully",
        });
      });
    } else if (res.user.accountStatus == "banned") {
      User.updateOne(res.user, { accountStatus: "active" }).then(() => {
        // index(req, res);
        return res.status(200).json({
          message: "User account status set to banned successfully",
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

function setStatusToDeleted(req, res) {
  if (res.user._id == res.userId) {
    User.updateOne(res.user, { accountStatus: "deleted" }).then(() => {
      return res.status(200).json({
        message: "User account status set to deleted successfully",
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

async function changePassword(req, res) {
  if (res.user._id == res.userId) {
    const { oldPassword, newPassword } = req.body;
    const userPassword = await User.findOne(res.user._id).then(
      (user) => user.password
    );

    bcrypt
      .compare(oldPassword, userPassword)
      .then((isIdentical) => {
        if (isIdentical) {
          const hashedPassword = bcrypt.hashSync(newPassword, 10);
          User.updateOne(
            { _id: res.user._id },
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
  } else {
    return res.status(403).json({
      message: "You're not authorized to make this change!",
      method: req.method,
      url: req.originalUrl,
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user.accountStatus == "deleted" || user.accountStatus == "banned") {
    return res.status(403).json({
      message: "Forbidden access... your account is deleted or banned!",
    });
  } else {
    bcrypt
      .compare(password, user.password)
      .then((isIdentical) => {
        if (isIdentical) {
          const token = jwt.sign({ userId: user._id }, process.env.AUTH_SECRET);
          res.header("Authorization", `Bearer ${token}`);

          User.updateOne(
            { _id: user._id },
            { lastLoginDate: new Date() }
          ).catch((err) => {
            return res.status(500).json({
              message: `something went wrong!`,
              errorCode: err.code,
              errorMessage: err.message,
            });
          });

          return res.status(200).json({
            message: `Welcome back ${user.fname}!`,
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
  register,
  updateData,
  setStatusToDeleted,
  setStatusToBanned,
  changePassword,
  login,
  // signout,
};
