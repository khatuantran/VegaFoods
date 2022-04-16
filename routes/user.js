const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const upload = require('../api/multer')
/* GET users listing. */
router.get('/', userController.renderInformationPage);

router.get('/edit', userController.renderEditPage)
router.post('/edit', userController.editProfile)

router.get('/change-password', userController.renderChangePasswordPage)
router.post('/change-password', userController.changePassword)

router.post('/change-image', upload.single('userImage'), userController.changeImage)


// router.get('/order-list', userController.renderOrderPage)
// router.get('/order-list/cancle-order',  userController.cancleOrder)
// router.get('/order-list/recieved',  userController.recievedProduct)

module.exports = router;
