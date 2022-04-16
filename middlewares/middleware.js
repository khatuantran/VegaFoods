const user = require('../models/user');
const cart = require('../models/cart');
const loveItem = require('../models/loveItem');
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
        const link = url.parse(req.session.returnTo).pathname
        if(link === '/shoping-cart/add-to-cart' || link === '/shoping-cart/add-to-loveItem'){req.session.returnTo = '/'}
        if(req.user || link === '/user/activate'){           
            next()
        }else{

            res.redirect('/login')
        }
    }

    isLogin(req, res, next){
        if(req.user){
            res.redirect('/')
        }else{
            next()
        }
    }

    validationEmail(req, res, next){
        let wrong = req.body.repeatPassword !== req.body.password 
        if(wrong){
            res.render('register', {wrong, status: 'Invalid repeat password'})
        } else {
        
            user.findOne({email: req.body.email, isActivated: true}, function(err, userDoc){
                if(userDoc){
                    res.render('register', {wrong: true, status: 'Email is exist'})
                } else {
                    next();         
                }
            })
        }
    }
    isEmptyCart(req, res, next){
        // if(req.locals.totalPrice === 0){res.render('empty-cart')}
        // else next()
        next()
    }
}

module.exports = new Middlewares;


