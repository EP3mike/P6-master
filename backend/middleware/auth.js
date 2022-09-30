const jwt = require('jsonwebtoken');

const jwtSecretHash = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY2NDUxMDY1'

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //extracts token from auth header and only the token block
        const decodedToken = jwt.verify(token, `${jwtSecretHash}`); // verifies token by comparing pulled token to the secretHash string
        const userId = decodedToken.userId; // extracts user id from the token
        req.auth = { userId: userId };
        if(req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(403).json({
            error: new Error('Unauthorized request!')
        });
    }
};