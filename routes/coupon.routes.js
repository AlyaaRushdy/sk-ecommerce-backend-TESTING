const express = require("express"),
  router = express.Router(),
  couponCodeController = require("../controllers/couponCode.controller");

router.get("/", couponCodeController.index);
router.get("/:id", couponCodeController.show);
router.put("/:id", couponCodeController.update);
router.post("/", couponCodeController.store);
router.delete("/:id", couponCodeController.destroy);

module.exports = router;
