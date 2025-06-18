const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || req.cookies.token;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized, token missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer "

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized, invalid token' });
        }
        req.user = decoded; // Attach decoded user data to request
        next();
    });
};

module.exports = { isAuth };
