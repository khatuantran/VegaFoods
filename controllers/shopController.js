const products = require('../models/product');
const departments = require('../models/department');
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
        ])
            .then(([products]) =>{
                res.render('product-details', {prod: products})
            })
            .catch(next)
    }
}

module.exports = new ShopController;