const user = require('../models/user');
const order = require('../models/order');
const bcrypt = require('bcrypt');
const randomString = require('randomstring')
const cloudinary = require('../api/cloudinary')
// const resetEmail = require('../api/resetPasswordEmail')
const folderUploadFile = './VegaFoods/'
class UserController{
    renderInformationPage(req, res, next){
        res.render('user-profile')
    }
    async changeImage(req,res,next){
        if(!req.file){
            res.redirect('/user')
        }
        else {
            //kiem tra neu user da co 1 anh tren cloud thi xoa anh do tren cloud
            if(req.user.cloudinary_id !== "")
            {
                await cloudinary.uploader.destroy(req.user.cloudinary_id)
            }
            const result = await cloudinary.uploader.upload(req.file.path, {folder: '/Home/VegaFoods/'})
            console.log(result)
            const userUpdate = await user.updateOne({_id: req.user._id}, {img: result.secure_url, cloudinary_id: result.public_id})
            req.user.img = result.secure_url
            req.user.cloudinary_id = result.public_id
            // console.log(req.user.cloudinary_id)
            res.redirect('/user')
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
            user.findOneAndUpdate({email: req.body.email}, options, {new: true}, function(err, doc){
                if(doc){
                    res.redirect('/user')
                } else {
                    console.log(err)
                }
            })
        }

        renderChangePasswordPage(req, res, next){
            res.render('change-password')
        }

        async changePassword(req, res, next){
            const newPassword = req.body.newPassword
            const doc = await user.findOne({_id: req.user._id})
            if(doc){
                const isCorrectPass = await bcrypt.compare(req.body.oldPassword, doc.password)
                if(isCorrectPass){
                    bcrypt.hash(newPassword, 10, async function(err, passwordHash) {
                        if(!err){
                            await user.updateOne({_id: req.user._id}, {password: passwordHash})                            
                            res.redirect('/auth/logout')   
                        } else console.log(err)
                    })
                } else {
                    res.render('change-password', {wrongPassword: 1})
                }
            }

        }

}

module.exports = new UserController;