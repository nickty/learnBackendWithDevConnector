const jwt = require('jsonwebtoken')
const config = require('config')


module.exports = function(req, res, next){
    //get tthe token from header
    const token = req.header('x-auth-token')

   
    //check if no token 
    if(!token){
        return res.status(401).json({ msg : 'No Token, authorization failed'})

    }

    //verify token 
    try {
        const decoded = jwt.verify(token, config.get('asecret'))
        
        req.user = decoded.user; 
        next(); 
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid'})
    }
}