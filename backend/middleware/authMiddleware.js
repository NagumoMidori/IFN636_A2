const jwt = require('jsonwebtoken');
const User = require('../models/User'); // 🔴 請確認你的檔案名是 User.js 而非 user.js

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                console.log("❌ [Auth] Token valid but User not found in DB");
                return res.status(401).json({ message: 'User not found' });
            }

            return next(); 
        } catch (error) {
            console.error("❌ [Auth] Token verification failed:", error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.log("❌ [Auth] No token provided in headers");
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.log(`❌ [Auth] Admin access denied for user: ${req.user?.username}, role: ${req.user?.role}`);
        res.status(403).json({ message: 'Access denied: Admin only' });
    }
};

module.exports = { protect, adminOnly };
