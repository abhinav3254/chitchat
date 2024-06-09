const jwt = require('jsonwebtoken');
require('dotenv').config();


function verifyToken(req, res, next) {
    console.log(req.cookies.token);
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Access denied' });
    try {
        let jwtSecret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, jwtSecret);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;