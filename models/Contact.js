const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  contactEmail: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please fill a valid email address"]
  },
  contactPhone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [/^[6-9]\d{9}$/, "Please fill a valid 10-digit Indian mobile number"]
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
    minlength: [10, "Message must be at least 10 characters long"],
    maxlength: [1000, "Message cannot exceed 1000 characters"]
  },
  isContact: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Contact", ContactSchema, 'webuser');

