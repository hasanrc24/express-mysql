const jwt = require("jsonwebtoken")
const db = require("../models");

const User = db.User;

const verifyJwt = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
          return res.status(401).json({
            message: 'Unauthorized request! No token provided.',
          });
        }
        const token = authHeader.replace("Bearer ", "");
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findOne({where : { uuid: decodedToken.uuid }, attributes: { exclude: ['refreshToken'] }})
        if(!user){
            return res.status(401).json({
                message: 'Invalid access token!'
            })
        }
        req.user = user
        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          return res.status(401).json({
            message: 'Invalid access token!',
          });
        }
        return res.status(401).json({error: error})
    }
}

module.exports = { verifyJwt }