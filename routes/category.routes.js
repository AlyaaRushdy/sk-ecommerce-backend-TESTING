const express = require("express"),
router = express.Router(),
CategoryController =require('../controllers/category.controller'),
CategoryMiddleware = require('../middlewares/categories.middleware');

router.post("/", CategoryMiddleware.upload, CategoryController.store);
router.get("/", CategoryController.index);
router.get('/:id',CategoryController.show);
router.put("/:id", CategoryMiddleware.upload, CategoryController.update);
router.delete('/:id',CategoryController.destroy);

module.exports = router;
