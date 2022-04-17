const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const admin = new Schema({
   // id: mongoose.ObjectId,
   fullName: String,
   email: {type: String, unique: true},
   phone: {type: String},
   work: {type: String},
   password: {type: String},
   address: {type: String},
   role: {type: Boolean, default: false},
   img: String,
   cloudinary_id: String,
   activationString: String,
   isActivated: Boolean,
   resetPasswordString: String,
});
admin.plugin(mongoosePaginate);
module.exports = mongoose.model('admins', admin);