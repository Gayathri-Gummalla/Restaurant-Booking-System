const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware: Protect admin routes
const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized - no token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized - user not found' });
        }

        // Attach user to request
        req.admin = user; // Keeping 'admin' property for backward compatibility with existing code
        req.isAdmin = user.role === 'admin';
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized - invalid token' });
    }
};

const optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            const user = await User.findById(decoded.id);
            if (user) {
                req.admin = user;
                req.isAdmin = user.role === 'admin';
            }
        }
    } catch (error) {
    }
    next();
};

module.exports = { protect, optionalAuth };
