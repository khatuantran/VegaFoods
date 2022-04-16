const user = require('../models/user');
const cart = require('../models/cart');
const order = require('../models/order');
const loveItem  = require('../models/loveItem');
const bcrypt = require('bcrypt');
const randomString = require('randomstring')
const activeEmailSender = require('../api/activeAccount')
// const cloudinary = require('../api/cloudinary')
// const resetEmail = require('../api/resetPasswordEmail')
class AuthController{
    
    //Find email of user
    findUserByEmail(emailAdress){
        return user.findOne({email: emailAdress}).lean()
    }

    // GET /login
    renderLogin(req, res, next){
        const wrongPassword = req.query.wrongPassword !== undefined
        res.render('login', {wrongPassword})
    }

    
    isValidPassword(password, user){

        return bcrypt.compare(password, user.password)
    }

    logout(req, res, next){
        delete req.session.returnTo
        req.logout()
        res.redirect('/')
    }


    renderRegistrationPage(req, res, next){
        res.render('register')
    }

    async activate(req, res, next){
        // console.log(req.query)
        const doc = await user.findOneAndUpdate({
            email: req.query.email, 
            activationString: req.query.activationString,
            isActivated: false,
        }, {isActivated: true})
        if(doc){
            req.login(doc, function(err) {
                if (err) { 
                    console.log(err)
                    return next(err); }
                return res.redirect('/');
              });
        }
        else {
            console.log("khong tim thay")
            return res.redirect('/');
        }
    }

    register(req, res, next){
        // console.log("next")
        const activationString = randomString.generate();
        // console.log("sai")
        bcrypt.hash(req.body.password, 10, function(err, passwordHash) {                                    
            user.create({
                email: req.body.email,
                phone: req.body.phoneNumber,
                role: 0,
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
                    activeEmailSender(req.body.email, activationString, req.hostname)
                    res.render('email-checking');
                    cart.create({
                        userID: doc._id,
                    })
                    loveItem.create({
                        userID: doc._id,
                    })
                    // req.login(doc, function (err){
                    //     if(!err) { res.redirect('/') }
                    //     else {console.log(err)}
                    // })
                } else {
                    const newActiveString = randomString.generate();
                    user.updateOne({email: req.body.email}, {
                        phone: req.body.phoneNumber,
                        fullName: req.body.fullName,
                        work: req.body.work,
                        password: passwordHash,
                        activationString: newActiveString
                    })
                        .then(docs => {
                            res.render('email-checking')
                            activeEmailSender(req.body.email, newActiveString, req.hostname)
                        })
                    
                }
            })

        });

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
            const result = await cloudinary.uploader.upload(req.file.path)
            const userUpdate = await user.updateOne({_id: req.user._id}, {img: result.secure_url, cloudinary_id: result.public_id})
            req.user.img = result.secure_url
            req.user.cloudinary_id = result.public_id
            // console.log(req.user.cloudinary_id)
            res.redirect('/user')
        }
     }
        // const result = await cloudinary.uploader.upload()

        renderForgetPassword(req, res, next){
            res.render('forget-password')
        }

        checkAndResetPassword(req, res, next){
            const resetPasswordString = randomString.generate();
            //console.log(req.body.email)
            user.findOneAndUpdate({email: req.body.email}, {resetPasswordString}, {new: true}, function(err, doc){
                if(doc){
                    resetEmail(req.body.email, resetPasswordString, req.hostname)
                    res.render('email-checking')
                } else {
                    res.render('forget-password', {wrongEmail: 1})
                }
            })
        }

        renderResetPassword(req, res, next){
            res.render('new-password', {emailAddress: req.query.email, resetPasswordString: req.query.resetPasswordString})
        }

        resetPassword(req, res, next){
            const email = req.body.emailAddress;
            const password = req.body.newPassword;
            const resetPassword = req.body.resetPasswordString;

            const newResetPassword = randomString.generate();
            bcrypt.hash(password, 10, function(err, passwordHash) {
                user.findOneAndUpdate(
                    {email: email, resetPasswordString: resetPassword}, 
                    {resetPasswordString: newResetPassword, password: passwordHash}, {new: true}, 
                    function(err, doc){
                        if(doc){
                            res.redirect('/login')
                        } else {
                            console.log(err)
                            res.render('new-password', {emailAddress: "Something is error please try again!", connectPermitted: 1})
                            // res.redirect('/')
                        }
                })
            })
        }
}

module.exports = new AuthController;