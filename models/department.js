const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const department = new Schema({
//   author: ObjectId,
   name: String,
   img: String,
   slug: String,
});

module.exports = mongoose.model('departments', department);