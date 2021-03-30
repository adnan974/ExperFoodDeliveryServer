const jwtModule = require('../jwt-module')

exports.authJwtCheck = (req, res, next) => {  
    
    if (!req.header('Authorization')) {        
        return res.status(401).json({ success: false, message: 'no authorization header' });
    } else {      
        
        const authorizationsParts = req.header('Authorization').split(' ');
        let token = authorizationsParts[1];
        let decoded = null;

        try {
            decoded = jwtModule.verifyJwt(token);
          } catch(err) {
            return res.status(401).json({ success: false, message: 'invalid token' });
          }
          
        req.user = {id : decoded.id, email: decoded.email, role: decoded.role, token: token}; 
        
        next();
    }
    
}