const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')
const upload = require('../api/multer')
/* GET users listing. */
router.get('/', adminController.renderInformationPage);

router.get('/edit', adminController.renderEditPage)
router.post('/edit', adminController.editProfile)

router.get('/change-password', adminController.renderChangePasswordPage)
router.post('/change-password', adminController.changePassword)

router.post('/change-image', upload.single('userImage'), adminController.changeImage)


// router.get('/order-list', userController.renderOrderPage)
// router.get('/order-list/cancle-order',  userController.cancleOrder)
// router.get('/order-list/recieved',  userController.recievedProduct)

router.get('/product/edit/:id',  adminController.renderEditProductPage)

router.get('/product/create', adminController.renderCreateProductPage)

router.post('/product/create', upload.single('productImage'), adminController.createProduct)

router.post('/product/edit/:id', upload.single('productImage'), adminController.editProduct)

router.get('/product/delete/:id', adminController.deleteProduct)

router.get('/order', adminController.renderOrderPage)

router.get('/order/cancle-order', adminController.cancleOrder);

router.get('/order/accept', adminController.acceptOrder);

router.get('/create-admin', adminController.renderCreateAdminPage)

router.post('/create-admin', middleware.validationEmail, adminController.createAdmin)
module.exports = router;