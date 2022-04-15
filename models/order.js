const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const order = new Schema({
   userID: mongoose.ObjectId,
   userName: String,
   userAddress: String,
   userEmail: String,
   phoneNumber: String,
   itemList: [{
    productId: mongoose.ObjectId,
    productName: String,
    productPrice: Number,
    quantity: Number
   }], 
   state: {type: String, default:'waiting'},
   total: Number,
   note: String,
});
   
module.exports = mongoose.model('orders', order);