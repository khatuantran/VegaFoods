const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loveitem = new Schema({
   userID: mongoose.ObjectId,
   itemList: {type: [{idProduct: mongoose.ObjectId}] , default: []}
});
   
module.exports = mongoose.model('loveitems', loveitem);