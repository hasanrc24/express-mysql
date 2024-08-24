const jwt = require("jsonwebtoken");
const db = require("../models");
const multer = require("multer");
const crypto = require("crypto")

const User = db.User;

const generateAccessAndRefreshToken = async (uuid) => {
  const accessToken = jwt.sign({ uuid }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign({ uuid }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
  // const user = await User.findOne({where: {uuid: uuid}})
  await User.update(
    { refreshToken: refreshToken },
    {
      where: {
        uuid: uuid,
      },
    }
  );
  return { accessToken, refreshToken };
};

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

const getCryptoToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

const getCryptoEncryptedToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

const createPasswordResetToken = (user) => {
  const resetToken = getCryptoToken();
  user.passwordResetToken = getCryptoEncryptedToken(resetToken)
  user.resetTokenExpire = Date.now() + 10 * 60 * 1000;
  return resetToken
}

const createUserVerificationToken = (user) => {
  const resetToken = getCryptoToken();
  user.verificationToken = getCryptoEncryptedToken(resetToken)
  return resetToken
}

module.exports = { generateAccessAndRefreshToken, multerErrorHandler, createPasswordResetToken, getCryptoToken, getCryptoEncryptedToken, createUserVerificationToken };
