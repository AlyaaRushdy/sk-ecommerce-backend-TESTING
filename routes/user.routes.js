const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/user.controller"),
  middleware = require("../middlewares/user.middleware"),
  {
    authenticateAdminToken,
    authenticateUserToken,
  } = require("../middlewares/auth.middleware");

router.get("/", controller.index);
router.get("/email", middleware.getUserByEmail, controller.show);
router.get("/:id", middleware.getUserById, controller.show);

router.post("/register", controller.register);
router.post("/login", middleware.getUserByEmail, controller.login);
// router.post("/signout", middleware.getUserByEmail, controller.signout);

router.put(
  "/deleteAccount/:id",
  authenticateUserToken,
  middleware.getUserById,
  controller.setStatusToDeleted
);

router.put(
  "/banAccount/:id",
  authenticateAdminToken,
  middleware.getUserById,
  controller.setStatusToBanned
);

router.put(
  "/changePassword/:id",
  authenticateUserToken,
  middleware.getUserById,
  controller.changePassword
);

router.put(
  "/:id",
  authenticateUserToken,
  middleware.getUserById,
  middleware.upload.single("profileImage"),
  controller.updateData
);

module.exports = router;
