const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/shippingCost.controller"),
  middleware = require("../middlewares/shippingCost.middleware");

router.get("/", controller.index);
router.get("/place", middleware.getShippingCostByPlace, controller.show);
router.get("/:id", middleware.getShippingCostById, controller.show);
router.post("/", controller.store);
router.put("/:id", middleware.getShippingCostById, controller.update);
router.delete("/:id", middleware.getShippingCostById, controller.destroy);

module.exports = router;
