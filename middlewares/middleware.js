const admin = require('../models/admin');
const product = require('../models/product');
const url = require('url');
const randomString = require('randomstring')



class Middlewares{
    //set local variable if user logged in
    loginCheck(req, res, next) {
        res.locals.user = req.user || undefined;
        next()
    }

    
    // if the user hasn't logged, then prevent user go to information page
    loginGuard(req, res, next){
        req.session.returnTo = req.originalUrl;
        if(req.user){           
            next()
        }else{
            res.redirect('/auth/login')
        }
    }

    loginAfterLogin(req, res, next){
        if(req.user){
            res.redirect('/')
        }else{
            next()
        }
    }

    validationEmail(req, res, next){
        let wrong = req.body.repeatPassword !== req.body.password 
        if(wrong){
            res.render('register', {status: 'Invalid repeat password'})
        } else {
        
            admin.findOne({email: req.body.email, isActivated: true}, function(err, userDoc){
                if(userDoc){
                    res.render('register', {status: 'Email is exist'})
                } else {
                    next();         
                }
            })
        }
    }

}

module.exports = new Middlewares;


