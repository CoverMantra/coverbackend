const fs = require('fs');
const path = 'd:/websiteCV/coverbackend/routes/userRoutes.js';
let c = fs.readFileSync(path, 'utf8');

c = c.replace('const router = express.Router();', `const router = express.Router();\nconst authMiddleware = require("../middlewares/authMiddleware");\nconst rateLimit = require("express-rate-limit");\n\nconst authLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 5,\n  message: { message: "Too many requests from this IP, please try again after 15 minutes" }\n});`);
c = c.replace('router.post("/register", async', 'router.post("/register", authLimiter, async');
c = c.replace('router.post("/send-otp", async', 'router.post("/send-otp", authLimiter, async');
c = c.replace('router.post("/profile", async', 'router.post("/profile", authMiddleware, async');
c = c.replace('router.post("/delete-profile", async', 'router.post("/delete-profile", authMiddleware, async');
c = c.replace('router.put("/update-profile", async', 'router.put("/update-profile", authMiddleware, async');
c = c.replace('router.post("/filter-lenders", async', 'router.post("/filter-lenders", authMiddleware, async');

// Update multiple req.body.phone
c = c.replace(/const \{ phone \} = req\.body;/g, 'const phone = req.user?.phone || req.body.phone; // Fallback for transition');
c = c.replace(/const \{ phone, message, email \} = req\.body;/g, 'const phone = req.user?.phone || req.body.phone;\n    const { message, email } = req.body;');

c = c.replace('const token = generateToken(phone);', 'const token = generateToken({ phone });');

fs.writeFileSync(path, c);
console.log("Done");
