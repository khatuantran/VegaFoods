const user = require('../models/user');
const admin = require('../models/admin');
const order = require('../models/order');
const bcrypt = require('bcrypt');
const randomString = require('randomstring')
const activeEmailSender = require('../api/activeAccount')
// const cloudinary = require('../api/cloudinary')
const resetEmail = require('../api/resetPasswordEmail')
class AuthController{
    renderForgetPassword(req, res, next){
        res.render('forget-password')
    }

    checkAndResetPassword(req, res, next){
        const resetPasswordString = randomString.generate();
        //console.log(req.body.email)
        admin.findOneAndUpdate({email: req.body.email}, {resetPasswordString}, {new: true}, function(err, doc){
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
            admin.findOneAndUpdate(
                {email: email, resetPasswordString: resetPassword}, 
                {resetPasswordString: newResetPassword, password: passwordHash}, {new: true}, 
                function(err, doc){
                    if(doc){
                        res.redirect('/auth/login')
                    } else {
                        console.log(err)
                        res.render('new-password', {emailAddress: "Something is error please try again!", connectPermitted: 1})
                        // res.redirect('/')
                    }
            })
        })
    }
    //Find email of user
    findUserByEmail(emailAddress){
        return admin.findOne({email: emailAddress})
    }

    // GET /login
    renderLogin(req, res, next){
        const wrongPassword = req.query.wrongPassword !== undefined
        res.render('login', {wrongPassword})
    }

    
    isValidPassword(password, admin){
        return bcrypt.compare(password, admin.password)
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
        const doc = await admin.findOneAndUpdate({
            email: req.query.email, 
            activationString: req.query.activationString,
            isActivated: false,
        }, {isActivated: true})
        if(doc){
            req.login(doc, function(err) {
                if (err) { return next(err) }
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
            admin.create({
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
                            activeEmailSender(req.body.email, newActiveString, req.hostname)
                        })
                }
            })

        });

    }
    
}

module.exports = new AuthController;