
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const middleware = require('../middlewares/product.middleware');

router.post('/',
    middleware.upload, 
    ProductController.store);

router.put('/:id',
    middleware.upload, 
    ProductController.update);

router.get('/', ProductController.index);
router.get('/:id', ProductController.show);
router.delete('/:id', ProductController.destroy);

module.exports = router;