const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cart = new Schema({
   userID: mongoose.ObjectId,
   itemList: {type: [{idProduct: mongoose.ObjectId, quantity: Number}] , default: []}
});

module.exports = mongoose.model('carts', cart);