const mongoose = require("mongoose");

const VivifiResponseSchema = new mongoose.Schema({
    // User Basic Info
    mobile: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    pan: { type: String },
    dob: { type: String },      // Format: DD/MM/YYYY as per specs
    pincode: { type: String },
    income: { type: Number },

    // Vivifi API Data
    leadId: { type: String },         // "Customer UniqueID" from API
    redirectionUrl: { type: String },  // "RedirectionUrl" from API
    status: { type: String, default: "Pending" },
    errorMessage: { type: String },    // To store specific reason for rejection
    fullResponse: { type: Array },    // Original array response for debugging
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("VivifiResponse", VivifiResponseSchema);