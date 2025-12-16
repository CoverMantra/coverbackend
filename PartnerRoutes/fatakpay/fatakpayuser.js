const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  pan: { type: String, required: true, unique: true },
  employment_type_id: { type: String, required: true },
  pincode: { type: String, required: true },
  partnerId: { type: String, default: 'Covermantra' },
  fatakpayResponse: { type: Object } 
}, { timestamps: true });

module.exports = mongoose.model('FatakPayUser', userSchema);

