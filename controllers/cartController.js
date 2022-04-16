const cart = require('../models/cart');
const loveItem = require('../models/loveItem')
const product = require('../models/product')
const order = require('../models/order')
// const upload = require('../cloudinary/multer')

class CartController{
    renderCart(req, res, next){
        cart.findOne({userID: req.user._id}, (err, cartItem) =>{
            let itemList = []
            if(cartItem.itemList.length > 0){
                const itemIdCart = cartItem.itemList.map((item) => {return item.idProduct})
                let cost = 0
                product.find({_id: {$in: itemIdCart}}, (err, doc) => {                    
                if(doc){                        
                    for(let i = 0; i < doc.length; i++){
                        let found = cartItem.itemList.find(item => {return item.idProduct.equals(doc[i]._id)})
                        let price = doc[i].price - (doc[i].price*(doc[i].percentSale/100))
                        cost = cost + doc[i].price*found.quantity
                        const item = {
                            id: doc[i]._id,
                            quantity: found.quantity, 
                            price: price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 
                            total: (price*found.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                            imgLink: doc[i].img,
                            name: doc[i].name,
                        }
                        itemList.push(item)
                    }                   
                    res.locals.totalCost = cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    res.render('shoping-cart', {itemList})
                    
                } else {console.log(err)}
                }) 
            } else if(err){console.log(err)} else {res.render('shoping-cart', {itemList})}
        })
    }
    
    addToLove(req, res, next){
        if(!req.user){
            return res.json('login')
        }
        const userID = req.user._id
        const idProduct = req.query.productID
        loveItem.findOne({userID, itemList: {$elemMatch: {idProduct}}}).then((product) => {
            if(product){
                res.json({number: product.itemList.length || 0})
            } else {
                loveItem.findOneAndUpdate(
                {userID},
                {$push: {itemList: {idProduct: idProduct}}},
                {new: true},
                function(err, doc){
                    if(doc){ 
                        // console.log(doc)
                        res.json({number: doc.itemList.length})
                        // console.log("Add new")
                    }
                })
            }
        })
    }
    
    addTocart(req, res, next){
        if(!req.user){
            return res.json('login')
        }
        const quantityProduct = Number(req.query.quantity)

        const userID = req.user._id
        const idProduct = req.query.productID
        cart.findOne({userID, itemList: {$elemMatch: {"idProduct": idProduct}}}).then((userCart) => {
            if(userCart){
                for(var i = 0; i < userCart.itemList.length; i++) {
                    if(userCart.itemList[i].idProduct == idProduct){
                        userCart.itemList[i].quantity += quantityProduct
                    }
                }                                                                              // new: true -> return document after update
                cart.findOneAndUpdate({userID: userCart.userID}, {itemList: userCart.itemList}, {new: true}, function(err, userCart) {
                    if(userCart){
                        // console.log(product)
                        res.json({number: userCart.itemList.length})
                    }
                })
            } else {
                cart.findOneAndUpdate(
                {userID},
                {$push: {itemList: {idProduct, quantity: quantityProduct}}},
                {new: true},
                function(err, doc){
                    if(doc){ 
                        // console.log(doc)
                        res.json({number: doc.itemList.length})
                        // console.log("Add new")
                    }
                })
            }
        })
    }

    renderCheckout(req, res, next) {
        // res.render('checkout', {activeCheckout: true})
        cart.findOne({userID: req.user._id}, (err, cartItem) =>{
            let itemList = []
            if(cartItem.itemList.length > 0){
                const itemIdCart = cartItem.itemList.map((item) => {return item.idProduct})
                let cost = 0
                product.find({_id: {$in: itemIdCart}}, (err, doc) => {                    
                if(doc){                        
                    for(let i = 0; i < doc.length; i++){
                        let found = cartItem.itemList.find(item => {return item.idProduct.equals(doc[i]._id)})
                        let price = doc[i].price - (doc[i].price*(doc[i].percentSale/100))
                        cost = cost + doc[i].price*found.quantity
                        const item = {
                            id: doc[i]._id,
                            quantity: found.quantity, 
                            price: price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 
                            total: (price*found.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                            name: doc[i].name,
                        }
                        itemList.push(item)
                    }                   
                    res.locals.totalCost = cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    res.render('checkout', {itemList, activeCheckout: true})
                    
                } else {console.log(err)}
                }) 
            } else if(err){console.log(err)} else {res.redirect('/shoping-cart')}
        })
    }

    updateCart(req, res, next) {
        cart.updateOne({userID: req.user._id}, {itemList: req.body.items}, function (err, doc){
            if(doc){
                res.json('update')
            }
        })
    }

    renderLoveItemPage(req, res, next){
        loveItem.findOne({userID: req.user._id}, function (err, items){
            let itemList = []
            if(items){
                const itemIdCart = items.itemList.map(function(item){return item.idProduct})
                product.find({_id: {$in: itemIdCart}}, (err, doc) => {
                    if(doc){
                        for(let i = 0; i < doc.length; i++){
                            let price = doc[i].price - (doc[i].price*(doc[i].percentSale/100))
                            const item = {
                                id: doc[i]._id,
                                price: price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 
                                name: doc[i].name,
                                imgLink: doc[i].img,
                            }
                            itemList.push(item)}
                            res.render('wishlist', {itemList})
                    } else {res.render('wishlist', {itemList})}
                })
            } else {res.render('wishlist', {itemList})}
        })
    }

    updateLoveItem(req, res, next) {
        req.body.items
        loveItem.updateOne({userID: req.user._id}, {itemList: req.body.items}, function (err, doc){
            if(doc){
                res.json('update')
            }
        })
    }


    async orderProduct(req, res, next){
        const itemList = []
        const userID = req.user._id;
        const userName = req.body.firstName + ' ' + req.body.lastName;
        const userEmail = req.body.email;
        const phoneNumber = req.body.phone;
        const userAddress = req.body.houseNumber + ', ' + req.body.ward + ', ' + req.body.district + ', ' + req.body.city;
        const note = req.body.orderNote;
        const total = req.body.totalPrice
        for(let i = 0; i < req.body.productName.length; i++){
            itemList.push({
                productId: req.body.productId[i],
                productName: req.body.productName[i],
                quantity: req.body.productQuantity[i],
                productPrice: req.body.price[i],
            })
        }
        const doc = {userID, userName, userAddress, userEmail, phoneNumber, itemList, total, note}
        await order.create(doc)
        cart.updateOne({userID: req.user._id}, {"$set": {"itemList": []}}, function (err, doc){
            if(doc){
                res.redirect('/user/order-list')
            } else {console.log(err)}
        })
    }
}

module.exports = new CartController;