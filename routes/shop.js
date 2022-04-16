const express = require('express');
const router = express.Router();
// const product = require('../model/product');

const shopController = require('../controllers/shopController')



//GET /Shop-grid/:id
router.get('/:id', shopController.renderDetail);

//GET /shop-grid
router.get('/', shopController.renderShop)

// router.get('/department/:id', shopGridController.renderDepartment)
// router.post('/:id/comment', shopController.commentProduct);

module.exports = router;
