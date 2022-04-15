const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const product = new Schema({
//   author: ObjectId,
  name: { type:String, unique:true},
  price: Number,
  img: String,
  description: String,
  information: String,
  // createdAt: {type: Date, default:Date.now},
  percentSale: {type:Number, default:0},
  type: String,
  featured: {type:Boolean, default: false},
}, {timestamps:true});
product.plugin(mongoosePaginate);
module.exports = mongoose.model('products', product);