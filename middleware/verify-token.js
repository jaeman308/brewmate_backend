const jwt = require('jsonwebtoken');

function verifyToken (req, res, next) {
    console.log("Authorization Header:", req.headers.authorization);
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error){
        res.status(401).json({error: "Invalid authorization token"})
    }
};
module.exports = verifyToken;