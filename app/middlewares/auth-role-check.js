
module.exports = authorize;

function authorize  (roles = [])  {

    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req,res,next)=>{       
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(401).json({
                success:false,
                message : `Unauthorized .You don't have the required roles`
            })
        }

        next();
    }
    
}