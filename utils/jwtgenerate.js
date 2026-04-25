const jwt = require("jsonwebtoken");
require("dotenv").config();

// Pro Tip: Deployment ke waqt .env hi use karein
const JWT_SECRECT_KEY = process.env.JWT_SECRECT || "Thiskeyforthetokengenerrate";
const TOKEN_EXPIRE = process.env.JWT_EXPIRES_TIME || "1d";

// FIXED: Removed extra curly braces around payload to keep it clean
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRECT_KEY, { expiresIn: TOKEN_EXPIRE });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRECT_KEY);
  } catch (e) {
    return null;
  }
}

// FIXED: Corrected math (1000 instead of 100)
function isTokenExpired(token) {
  try {
    const decode = jwt.decode(token);
    if (!decode || !decode.exp) return true;
    return decode.exp * 1000 < Date.now(); 
  } catch (error) {
    return true;
  }
}

module.exports = {
  generateToken,
  verifyToken,
  isTokenExpired,
};