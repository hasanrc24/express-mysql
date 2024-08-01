const jwt = require('jsonwebtoken');
const db = require("../models");

const User = db.User

const generateAccessAndRefreshToken = async (uuid) => {
    const accessToken = jwt.sign({uuid}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({uuid}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '20m' })
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

module.exports = { generateAccessAndRefreshToken }