const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// Add item to cart
router.post('/', cartController.addToCart);

// Update cart item
router.put('/:cartId', cartController.update);

// Remove product(s) from the cart
router.delete('/:userId', cartController.removeProductsFromCart);

// Get cart items for a specific user
router.get('/:userId', cartController.show);

// Clear entire cart for a user
router.delete('/clear/:userId', cartController.clearCart);

module.exports = router;
