
const jwt = require('jsonwebtoken');
//require('dotenv').config();

//const secretKey = 'the';
require('dotenv').config();
const secretKey = process.env.secretKey;

function verifyToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authorizationHeader.split(' ')[1];
    const decodedToken = jwt.decode(token, { complete: true });
    console.log('Decoded Token:', decodedToken);
    jwt.verify(token, secretKey, (err, decoded) => {
        console.log(secretKey);
        
        if (err) {
            console.error('JWT Verification Error:', err.message);
            return res.status(401).json({ error: 'Token is not valid' });
        }

        // Attach the decoded payload to the request object
        req.user = decoded;
        next(); // Move to the next middleware or route handler
    });
}

module.exports = verifyToken;
