// Generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
// Verify OTP
function verifyOTP(phone, otp) {
  const record = otpStore[phone];
  if (!record) {
    console.log(`[VERIFY OTP] No OTP found for phone: ${phone}`);
    return false;
  }

  const now = Date.now();
  const isValid = record.otp === otp && now < record.expiresAt;

  if (isValid) {
    delete otpStore[phone];
    console.log(`[VERIFY OTP] OTP valid and verified for phone: ${phone}`);
  } else {
    console.log(`[VERIFY OTP] Invalid OTP or expired for phone: ${phone}`);
  }

  return isValid;
}

module.exports = { generateOTP, verifyOTP };
