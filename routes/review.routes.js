const express = require('express'),
router = express.Router(),
ReviewController =require('../controllers/review.controller');

router.post('/', ReviewController.store)
router.get('/', ReviewController.index)
router.get('/:id', ReviewController.show)
router.get('/product/:productId', ReviewController.getByProductId)
router.put('/:id', ReviewController.update)
router.delete('/:id', ReviewController.destroy)


module.exports = router;


