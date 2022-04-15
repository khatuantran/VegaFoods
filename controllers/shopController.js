const products = require('../models/product');
const departments = require('../models/department');
const comment = require('../models/comment')
class ShopController{
    
    //GET '/'
    renderShop(req, res, next){
        let nameSearch
        if(!req.query.name){
            nameSearch=""
        }else{
            nameSearch = req.query.name
        }
        const minPrice = req.query.minprice || 1
        const maxPrice = req.query.maxprice || 100

        let queries = {
            name: { $regex: '.*' + nameSearch + '.*', $options: 'i'}, //Case insensitivity to match upper and lower cases.
            type: req.query.department ||  { "$ne": 'null' },
            price: { "$gte": minPrice, "$lte": maxPrice}
        }

        Promise.all([
            products.paginate(queries, {page: req.query.page || 1, limit: 9,}), //mongoose-paginate-v2 library
            products.find({ percentSale: { $gt: 0}}),
            departments.find({}),
            products.find({}).limit(6).sort({createdAt: -1}).exec()
        ])
            .then(([products, productSale, departments, latest]) =>{
                latest = [latest.slice(0,3), latest.slice(3,6)]
                res.render('shop',{products, productSale, departments, latest, activeShopGrid: true, minPrice, maxPrice})
            })
            .catch(next)
    }
    
    // GET /shop-grid/:id
    renderDetail(req, res, next){
        
        Promise.all([
            products.findById(req.params.id),
            comment.paginate({productId: req.params.id}, {page: req.query.page || 1, limit: 3, sort: {createdAt: -1}}),           
        ])
            .then(([products, comments]) =>{
                const commentUser = comments.docs.map((comment) =>{
                    const date = comment.createdAt
                    const timeComment = date.getHours() + 'h' + date.getMinutes() + ' - ' + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
                    return {
                        userName: comment.userName,
                        timeComment,
                        content: comment.content
                    };
                })
                res.render('product-details', {prod: products, totalComment: comments, comments: commentUser})
            })
            .catch(next)
    }

    commentProduct(req, res, next){
        const userComment = req.body.comment
        comment.create({
            productId: userComment.productId,
            content: userComment.content,
            userName: userComment.userName
        }, function(err, doc){
            if(doc){
                res.json('sucess')
            } else {console.log(err)}
        })
    }
}

module.exports = new ShopController;