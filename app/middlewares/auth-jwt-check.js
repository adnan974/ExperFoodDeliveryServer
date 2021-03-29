const jwt = require('jsonwebtoken');
const config = require('../../config')

exports.authJwtCheck = (req, res, next) => {    
    if (!req.header('Authorization')) {        
        return res.status(401).json({ success: false, message: 'no authorization header' });
    } else {      
        
        const authorizationsParts = req.header('Authorization').split(' ');
        let token = authorizationsParts[1];

        try {
            var decoded = jwt.verify(token, config.secret);
          } catch(err) {
            return res.status(401).json({ success: false, message: 'invalid token' });
          }

        req.token = token;
        next();
    }
}