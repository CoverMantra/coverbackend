const mongoose = require('mongoose');

// Main User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true }, // Added Index here for Phase 1
    pan: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    gender: { type: String, required: true },
    employment: { type: String, required: true },
    income: { type: String, required: true },
    pincode: { type: String, required: true },
    lenderResponses: [{
        lenderName: { type: String },
        apiResponse: { type: mongoose.Schema.Types.Mixed },
        createdDate: { type: String }
    }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

// Delete Request Schema (Recommended: Different Collection)
const deleteRefSchema = new mongoose.Schema({ 
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

// ✅ User model targeting your existing 'webuser' collection
const webusername = mongoose.model('webusername', userSchema, 'webuser');

// ✅ Alag collection for delete requests (taaki user data corrupt na ho)
const DeleteRequest = mongoose.model('DeleteAcc', deleteRefSchema, 'account_deletion');

module.exports = {
    webusername,
    DeleteRequest
};