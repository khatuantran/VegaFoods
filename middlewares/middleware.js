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
        if(req.user){
            Promise.all([
                cart.findOne({userID: req.user._id}),
                loveItem.findOne({userID: req.user._id})
            ]).then(([cartItem, loveItem])=>{
                // console.log(cartItem)
                res.locals.cartItem = cartItem.itemList.length;
                res.locals.loveItem = loveItem.itemList.length;
                let sum = 0;
                res.locals.totalPrice = sum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                if(cartItem.itemList.length > 0){
                    const itemIdCart = cartItem.itemList.map((item) => {return item.idProduct})
                    product.find({_id: {$in: itemIdCart}}, (err, doc) => {                    
                    if(doc){                        
                        for(let i = 0; i < doc.length; i++){
                            let found = cartItem.itemList.find(item => {return item.idProduct.equals(doc[i]._id)})
                            let price = doc[i].price - (doc[i].price*(doc[i].percentSale/100))
                            sum = sum + price*found.quantity
                        }
                    } else {console.log(err)}
                    res.locals.totalPrice = sum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    return next()
                    }) 
                } else return next()
                
            })
        } else return next();
    }

    
    // if the user hasn't logged, then prevent user go to information page
    loginGuard(req, res, next){
        req.session.returnTo = req.originalUrl;
        const link = url.parse(req.session.returnTo).pathname
        if(link === '/shoping-cart/add-to-cart' || link === '/shoping-cart/add-to-loveItem'){req.session.returnTo = '/'}
        if(req.user || link === '/auth/activate'){           
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
        
            user.findOne({email: req.body.email, isActivated: true}, function(err, userDoc){
                if(userDoc){
                    res.render('register', {status: 'Email is exist'})
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


