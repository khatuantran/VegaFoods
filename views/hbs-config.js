const path = require('path');
module.exports = (() => {
    const hbs = require('hbs');
    hbs.registerPartials(path.join(__dirname + '/partials'));
    

    hbs.registerHelper('renderPrice', function(object){
        let result = 0
        let priceSale = 0
        if(object.percentSale > 0){
          priceSale = (object.price - ((object.price*object.percentSale)/100))
          result = priceSale.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
        }
        else result = object.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
        return result
    })
    
    hbs.registerHelper('renderCost',function(object){
      if(object.percentSale > 0){
          return  `$${object.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
    })
    
    //if a product is saled, helper will render a div element with percent sale
    hbs.registerHelper('renderPercentSale', function(percentSale){
      if(percentSale > 0){
        let result = `<div class="product__discount__percent">-${percentSale}%</div>`
        return new hbs.SafeString(result);
      }
    })
    
    hbs.registerHelper('pagination', function(products){
      let result = ""
      if(products.totalPages > 1){    
        for(var i = 1; i <= products.totalPages; i++){
            if(i === products.page) {
              result+=`<a class="pagination-click pagination-active" href="page=${i}">${i}</a>`
            }
            else result+=`<a class="pagination-click" href="page=${i}">${i}</a>`
        }
      }
      return new hbs.SafeString(result);
    })
    
})()
