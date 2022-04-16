const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController')
const authController = require('../controllers/authController')

router.get('/', indexController.index);
module.exports = router;
