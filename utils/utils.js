const jwt = require('jsonwebtoken');
const db = require("../models");
const multer = require('multer');

const User = db.User

const generateAccessAndRefreshToken = async (uuid) => {
    const accessToken = jwt.sign({uuid}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
    const refreshToken = jwt.sign({uuid}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
    // const user = await User.findOne({where: {uuid: uuid}})
    await User.update(
        {refreshToken: refreshToken},
        {
            where: {
                uuid: uuid
            }
        }
    )
    return { accessToken, refreshToken }
}

const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  };

module.exports = { generateAccessAndRefreshToken, multerErrorHandler }