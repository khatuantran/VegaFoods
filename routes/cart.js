const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController')
/* GET home page. */
router.get('/', cartController.renderCart);
router.get('/add-to-cart', cartController.addTocart)
router.get('/add-to-loveItem', cartController.addToLove)
router.get('/checkout', cartController.renderCheckout)
router.post('/update-cart', cartController.updateCart)
router.get('/love-item', cartController.renderLoveItemPage)
router.post('/update-loveItem', cartController.updateLoveItem)
router.post('/checkout', cartController.orderProduct)
module.exports = router;