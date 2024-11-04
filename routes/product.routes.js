const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller");
const { uploadArray } = require("../utils/multer.config");

router.post("/", uploadArray("images", 5), ProductController.store);
router.put("/:id", uploadArray("images", 5), ProductController.update);
router.get("/", ProductController.index);
router.get("/:id", ProductController.show);
router.delete("/:id", ProductController.destroy);

module.exports = router;
