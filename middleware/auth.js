const jwt = require('jsonwebtoken');
const config = require('config');
// this module give access to a valid token to modify the data
//authorisation
//don't use the tokens on the server use them on the client app
//don't store the tokens on the db or encrypt it

module.exports = function auth(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provided.');

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }catch(ex){
        res.status(400).send('Invalid Token.')
    }
}
