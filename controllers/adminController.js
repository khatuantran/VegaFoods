const admin = require('../models/admin');
const user = require('../models/user');
const order = require('../models/order');
const product = require('../models/product');
const department = require('../models/department');
const bcrypt = require('bcrypt');
const randomString = require('randomstring')
const cloudinary = require('../api/cloudinary')
const emailSender = require('../api/activeAccount')
const folderUploadFile = './VegaFoods/'
class AdminController{
    renderInformationPage(req, res, next){
        res.render('user-profile')
    }
    async changeImage(req,res,next){
        if(!req.file){
            res.redirect('/admin')
        }
        else {
            //kiem tra neu user da co 1 anh tren cloud thi xoa anh do tren cloud
            if(req.user.cloudinary_id !== "")
            {
                await cloudinary.uploader.destroy(req.user.cloudinary_id)
            }
            const result = await cloudinary.uploader.upload(req.file.path, {folder: '/Home/VegaFoods/'})
            console.log(result)
            const userUpdate = await admin.updateOne({_id: req.user._id}, {img: result.secure_url, cloudinary_id: result.public_id})
            req.user.img = result.secure_url
            req.user.cloudinary_id = result.public_id
            // console.log(req.user.cloudinary_id)
            res.redirect('/admin')
        }
     }
        
    renderEditPage(req, res, next){
        res.render('edit-profile')
    }

    editProfile(req, res, next){
        req.user.fullName = req.body.fullName;
        req.user.phone = req.body.phone;
        req.user.address = req.body.address;
        req.user.work = req.body.work;
        const options ={
            fullName: req.body.fullName,
            phone: req.body.phone,
            address: req.body.address,
            work: req.body.work
        }
        admin.findOneAndUpdate({email: req.body.email}, options, {new: true}, function(err, doc){
            if(doc){
                res.redirect('/admin')
            } else {
                console.log(err)
            }
        })
    }

    renderChangePasswordPage(req, res, next){
        res.render('change-password')
    }

    renderProductPage(req, res, next){
        product.paginate({}, {page: req.query.page || 1, limit: 9,}, function(err, result){
            if(result){
                res.render('products', {product: result, activeProduct: 1})
            } else next()
        })
    }   


    renderEditProductPage(req, res, next){
        const idProduct = req.params.id           
        Promise.all([
            product.findOne({_id: idProduct}),
            department.find({}),
        ]).then(([product,department]) => {
            res.render('edit-product', {product, department})
        })
        
    }


    renderCreateProductPage(req, res, next){
        department.find({}, function(err,doc){
            if(doc){
                res.render('create-product', {department: doc})
            } else {
                console.log(err)
                next()
            }
        })
        
    }
    renderManageAdminPage(req, res, next){
        admin.paginate({}, {page: req.query.page || 1, limit: 9} , function(err, user){
            if(admin){
                res.render('admin', {users: user})
            } else {
                console.log(err)
                next()
            }
        })
    }
    async createProduct(req, res, next){
        if(!req.file){
            res.redirect('/admin/product/create')
        }
        else {
            const result = await cloudinary.uploader.upload(req.file.path)
            const item = {
                name: req.body.name,
                price: req.body.price,
                img: result.secure_url,
                cloudinary_id: result.public_id,
                description: req.body.description,
                information: req.body.information,
                percentSale: req.body.percentSale,
                type: req.body.type,
                featured: req.body.featured,
            }
            const doc = product.create(item)
            if(doc){
                res.redirect('/admin/product')
            } else {next()}
        }
    }

    async editProduct(req, res, next){
        if(!req.file){
            const doc = await product.findOneAndUpdate({_id: req.params.id}, {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                information: req.body.information,
                percentSale: req.body.percentSale,
                type: req.body.type,
                featured: req.body.featured,
            })
            if(doc) {
                res.redirect('/admin/product')
            } else {next()}
        }
        else {
            if(req.body.cloudinary_id !==''){
                await cloudinary.uploader.destroy(req.body.cloudinary_id)
            }
            const result = await cloudinary.uploader.upload(req.file.path)
            const doc = await product.findOneAndUpdate({_id: req.params.id}, {
                name: req.body.name,
                price: req.body.price,
                img: result.secure_url,
                cloudinary_id: result.public_id,
                description: req.body.description,
                information: req.body.information,
                percentSale: req.body.percentSale,
                type: req.body.type,
                featured: req.body.featured,
            })
            if(doc) {
                res.redirect('/admin/product')
            } else {next()}
        }
    }

    async deleteProduct(req, res, next){
        const idProduct = req.params.id
        const doc = await product.findOneAndDelete({_id: idProduct})
        //console.log(doc)
        if(doc){
            if(doc.img !==''){
                //console.log(doc.img)
                await cloudinary.uploader.destroy(doc.img)    
                //res.redirect('/admin/product') 
            }
            res.redirect('/admin/product') 
        } else {
            next()
        }
    }

    renderOrderPage(req, res, next){
        order.find({}, function(err, order){
            if(order){
                res.render('order-list', {orderList: order, activeOrder: true})
            } else {
                console.log(err)
                next()
            }
        })
    }

    cancleOrder(req, res, next){
        const orderId = req.query.orderId
        console.log(orderId)
        order.findOneAndDelete({_id: orderId, state: 'waiting'}, function(err, doc){
            if(doc){
                res.redirect('/admin/order')
            } else {
                console.log(err)
                res.redirect('/admin/order')
            }
        })
    }

    acceptOrder(req, res, next){
        const orderId = req.query.orderId
        // console.log(orderId)
        order.findOneAndUpdate({_id: orderId, state: 'waiting'}, {state: 'shipping'}, function(err, doc){
            if(doc){
                console.log(doc)
                res.redirect('/admin/order')
            } else {
                console.log(err)
                res.redirect('/admin/order')
            }
        })
    }

    renderCreateAdminPage(req, res, next){
        res.render('register')
    }


    createAdmin(req, res, next){
        // console.log("next")
        const activationString = randomString.generate();
        // console.log("sai")
        bcrypt.hash(req.body.password, 10, function(err, passwordHash) {
                                        
            admin.create({
                email: req.body.email,
                phone: req.body.phoneNumber,
                role: 1,
                fullName: req.body.fullName,
                work: req.body.work,
                password: passwordHash,
                address: '',
                img: 'https://bootdey.com/img/Content/avatar/avatar7.png',
                cloudinary_id: "",
                activationString,
                isActivated: false,
            }, (err, doc) => {
                if(!err){
                    emailSender(req.body.email, activationString, req.hostname)
                    res.render('email-checking');
                } else {
                    const newActiveString = randomString.generate();
                    admin.updateOne({email: req.body.email}, {
                        phone: req.body.phoneNumber,
                        fullName: req.body.fullName,
                        work: req.body.work,
                        password: passwordHash,
                        activationString: newActiveString
                    })
                        .then(docs => {
                            res.render('email-checking')
                            emailSender(req.body.email, newActiveString, req.hostname)
                        })
                    
                }
            })

        });

    }

    async changePassword(req, res, next){
        const newPassword = req.body.newPassword
        const doc = await admin.findOne({_id: req.user._id})
        if(doc){
            const isCorrectPass = await bcrypt.compare(req.body.oldPassword, doc.password)
            if(isCorrectPass){
                bcrypt.hash(newPassword, 10, async function(err, passwordHash) {
                    if(!err){
                        await admin.updateOne({_id: req.user._id}, {password: passwordHash})                            
                        res.redirect('/auth/logout')   
                    } else console.log(err)
                })
            } else {
                res.render('change-password', {wrongPassword: 1})
            }
        }

    }

}

module.exports = new AdminController;