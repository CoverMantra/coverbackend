const mongoose = require("mongoose");

const LenderResponseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    apiResponse: { type: mongoose.Schema.Types.Mixed }, // Supports both Object and Array
    createdDate: { type: String, required: true } // format: DD/MM/YYYY
});

module.exports = mongoose.model("LenderResponse", LenderResponseSchema, "lender_responses");
