const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config')


exports.createJwt = (user) => {
    return jwt.sign(
        {
            iss: jwtConfig.iss,
            id: user._id,
            email: user.email,
            role: user.role
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn });
}

exports.verifyJwt = (token) => {
    return jwt.verify(token, jwtConfig.secret);
}