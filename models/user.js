const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
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

module.exports = mongoose.model('admins', user);