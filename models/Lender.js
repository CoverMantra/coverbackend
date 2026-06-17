const mongoose = require('mongoose');

const lenderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String, default: "" },
    age: { type: Number, required: true },
    minIncome: { type: Number, required: true },
    pincodes: { type: [String], required: true },
    UTM: { type: String, required: true },
    priority: { type: Number, required: true, default: 0 },
    // Extended card metadata for config-driven UI
    approval: { type: String, default: "Good" },
    loanAmount: { type: String, default: "Up to ₹2,00,000" },
    interestRate: { type: String, default: "Starting from 1.5% per month" },
    processingFee: { type: String, default: "Starting from 2%" },
    support: { type: String, default: "24/7 customer support" },
    ratings: { type: Number, default: 4.0 },
    features: { type: [String], default: [] },
    applyLink: { type: String, default: "" }
}, { timestamps: true });

const Lender = mongoose.model('Lender', lenderSchema);

module.exports = Lender;
