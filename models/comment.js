const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const comment = new Schema({
   productId: mongoose.ObjectId,
   userName: String,
   content: String,
   createdAt: {type: Date, default:Date.now},
});
comment.plugin(mongoosePaginate);
module.exports = mongoose.model('comments', comment);