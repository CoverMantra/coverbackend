const mongoose = require('mongoose');

const lenderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String, default: "" },
    age: { type: Number, required: true },
    minIncome: { type: Number, required: true },
    pincodes: { type: [String], required: true },
    UTM: { type: String, required: true },
    priority: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const Lender = mongoose.model('Lender', lenderSchema);

module.exports = Lender;
