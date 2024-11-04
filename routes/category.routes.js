const express = require("express"),
  router = express.Router(),
  CategoryController = require("../controllers/category.controller");
const { authenticateAdminToken } = require("../middlewares/auth.middleware");
const { uploadSingle } = require("../utils/multer.config");

router.post(
  "/",
  authenticateAdminToken,
  uploadSingle("imageUrl"),
  CategoryController.store
);
router.get("/", CategoryController.index);
router.get("/:id", CategoryController.show);
router.get("/code/:code", CategoryController.getCategoryByCode);
router.put("/:id", uploadSingle("imageUrl"), CategoryController.update);
router.delete("/:id", CategoryController.destroy);

module.exports = router;
