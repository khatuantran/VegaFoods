const product = require('../models/product');
const departments = require('../models/department');

class IndexController{
    
    //GET '/'
    index(req, res, next){
        Promise.all([
            departments.find({}), // find all departments
            departments.find({name: ['Vegetables', 'Fastfood', 'Fresh meat', 'Fresh fruits', 'Drinks']}), // find departments with name in arr
            product.find({featured: true}), // find product feature
            product.find({}).limit(6).sort({createdAt: -1}).exec()  //find latest product
        ])
            .then(([departments, categories, featuredProducts, latest]) => {
                
                latest = [latest.slice(0,3), latest.slice(3,6)] //divide two array with 3 object each array
                //Delete all space in type of product
                featuredProducts.forEach((prod)=>{
                    prod.slug = prod.type.replace(" ", "-").toLowerCase()
                })
                res.render('index', {departments, categories, featuredProducts, latest, activeHome: true})
            })
    }
}

module.exports = new IndexController;