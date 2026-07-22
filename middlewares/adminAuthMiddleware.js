const authMiddleware = require("./authMiddleware");

const sanitizeSecret = (val) => {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
};

const combinedAdminAuth = (req, res, next) => {
  const secret = req.headers['x-admin-secret'];
  const cleanSecret = sanitizeSecret(secret);
  const expectedSecret = sanitizeSecret(process.env.ADMIN_SECRET);

  console.log(`[Admin Auth Check] Path: ${req.originalUrl}, Clean Secret: "${cleanSecret}", Clean Expected: "${expectedSecret}"`);

  if (cleanSecret && cleanSecret === expectedSecret) {
    return next();
  }

  // Otherwise, require valid JWT token and check user role
  authMiddleware(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admin only." });
    }
  });
};

module.exports = combinedAdminAuth;
