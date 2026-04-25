const { verifyToken } = require('../utils/jwtgenerate');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) return res.status(403).json({ message: "Invalid/Expired Token" });

    // Payload now contains user phone/id
    req.user = decoded; 
    next();
};

module.exports = authMiddleware;