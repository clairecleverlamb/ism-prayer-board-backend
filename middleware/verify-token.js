const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1] // ['Bearer', 'wfdwfwfwfweffeef.fdefefefefef.fefefe']
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.payload; // this adds the user object to req.user
        next(); // without calling next (calling the next middleware function) the request will stall

    } catch (error) {
        res.status(401).json({ error: 'Invalid Token' });
    }
}

module.exports = verifyToken;