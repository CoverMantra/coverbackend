const jwt = require("jsonwebtoken");
require("dotenv").config();

// Pro Tip: Deployment ke waqt .env hi use karein
const JWT_SECRECT_KEY = process.env.JWT_SECRET || process.env.JWT_SECRECT;
if (!JWT_SECRECT_KEY) {
  console.error("FATAL ERROR: JWT_SECRET or JWT_SECRECT is not defined in environment variables (.env).");
  process.exit(1);
}
if (JWT_SECRECT_KEY === "Thiskeyforthetokengenerrate") {
  console.error("FATAL ERROR: You are using the insecure default JWT secret ('Thiskeyforthetokengenerrate'). Please change the JWT_SECRECT value in your .env file to a secure random string.");
  process.exit(1);
}
const TOKEN_EXPIRE = process.env.JWT_EXPIRES_TIME || "7d";

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