const express = require("express"),
  router = express.Router(),
  orderController = require("../controllers/order.controller");

router.post("/", orderController.storeMod);
router.get("/:id", orderController.showMod);
router.get("/", orderController.indexMod);
router.get("/user/:id", orderController.getOrdersByUser);
router.put("/update/:id", orderController.updateOrdersStatus);

module.exports = router;
