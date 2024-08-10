const jwt = require("jsonwebtoken");
const db = require("../models");
const { asyncHandler } = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const User = db.User;

const verifyJwt = asyncHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    throw new ApiError(401, "Unauthorized request! No token provided");
  }
  const token = authHeader.replace("Bearer ", "");
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid access token", [], error.stack);
  }

  const user = await User.scope("withPassword").findOne({
    where: { uuid: decodedToken.uuid },
    attributes: { exclude: ["refreshToken"] },
  });
  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }
  req.user = user;
  next();
});

module.exports = { verifyJwt };
