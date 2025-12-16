const mongoose = require('mongoose');

// **Note: You don't need to import 'string' and 'required' from 'joi' here.**
// const { string, required } = require('joi'); 
// Removed the unnecessary Joi import.

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // Correction: 'require' should be 'required'
        required: true
    },
    phone: {
        type: String,
        // Correction: 'require' should be 'required'
        required: true
    },
    pan: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // Correction: 'require' should be 'required'
        required: true,
        unique: true // Recommended: email should usually be unique
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    employment: {
        type: String,
        required: true
    },
    income: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    }
});


userSchema.set('timestamps', true);

const deleteRefSchema = new mongoose.Schema({ 
    phone: {
        type: String,
        
        required: true
    },
    email: {
        type: String,
        
        required: true
    },
    message: {
        type: String,
        required: true
    },
});

deleteRefSchema.set('timestamps', true);

const User = mongoose.model('User', userSchema);
const DeleteRequest = mongoose.model('DeleteAcc', deleteRefSchema);


module.exports = {
    User,
    DeleteRequest
};