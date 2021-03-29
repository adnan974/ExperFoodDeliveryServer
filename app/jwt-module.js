const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config')


exports.createJwt = (user) => {
    return jwt.sign(
        {
            iss: jwtConfig.iss,
            email: user._email,
            role: user._role
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn });
}

exports.verifyJwt = (token) => {
    return jwt.verify(token, secret);
}