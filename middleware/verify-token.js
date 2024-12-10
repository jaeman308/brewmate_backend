const jwt = require('jsonwebtoken');

function verifyToken (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authorization token is required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error){
        res.status(401).json({error: "Unauthorization acess"})
    }
};
module.exports = verifyToken;