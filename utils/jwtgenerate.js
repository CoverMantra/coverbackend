const jwt = require("jsonwebtoken");
require("dotenv").config();
// const JWT_SECRECT_KEY = process.env.JWT_SECRECT;
const JWT_SECRECT_KEY = "Thiskeyforthetokengenerrate";
// const TOKEN_EXPIRE = process.env.JWT_EXPIRES_TIME;
const TOKEN_EXPIRE = "1d";

function generateToken(payload) {
  return jwt.sign({ payload }, JWT_SECRECT_KEY, { expiresIn: TOKEN_EXPIRE });
}
//update situ 59

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRECT_KEY);
  } catch (e) {
    return null;
  }
}

function isTokenExpired(token) {
  try {
    const decode = jwt.decode(token);
    if (!decode || !decode.exp) return true;
    return decode.exp * 100 < Date.now();
  } catch (error) {
    return true;
  }
}

module.exports = {
  generateToken,
  verifyToken,
  isTokenExpired,
};
