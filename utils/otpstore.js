// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Note: verifyOTP is now handled in routes using MongoDB Otp model.
// This function is deprecated and can be removed if not used elsewhere.
function verifyOTP(phone, otp) {
  // Since we're using MongoDB, this Map-based verification is not needed.
  // If you need to use this, define otpStore = new Map(); but better to use DB.
  console.log("verifyOTP called, but using DB in routes instead.");
  return false; // Placeholder
}

module.exports = { generateOTP, verifyOTP };
