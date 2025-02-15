const bcrypt = require("bcrypt");
const db = require("../models");
const { generateAccessAndRefreshToken, createPasswordResetToken, getCryptoEncryptedToken, createUserVerificationToken } = require("../utils/utils");
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const fs = require("fs");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const path = require("path");
const upload = require("../middlewares/imageMiddleware");
const Email = require("../utils/email");
const { Op } = require('sequelize');

const User = db.User;

const removePassword = (user) => {
  const userData = user.get({ plain: true });
  delete userData.password;
  return userData;
};

const getusers = asyncHandler(async (req, res) => {
  let users = await User.findAll({ attributes: { exclude: ["refreshToken"] } });
  if (!users) {
    throw new ApiError(500, "Internal server problem");
  }
  res.status(200).json(new ApiResponse(200, { users: users }, "Users list"));
});

const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, gender, email, password, number } = req.body;
  const file = req.file;

  if (!firstName || !lastName || !gender || !email || !password || !number) {
    throw new ApiError(400, "All fields are required");
  }
  let existingUser = await User.findAll({ where: { email: email } });
  if (existingUser.length > 0) {
    throw new ApiError(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    firstName,
    lastName,
    gender,
    email,
    password: hashedPassword,
    number,
  };
  if(file){
    const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    const filePath = path.join(__dirname, '../uploads/', filename);

    // Save the file to disk only after validation passes
    fs.writeFileSync(filePath, file.buffer);
    newUser.profileImage = `/uploads/${filename}`
  }

  const user = await User.create(newUser);

  const userVerificationToken = createUserVerificationToken(user)
  await user.save()
  const baseUrl = `${req.protocol}://${req.get('host')}/`
  await new Email(user, baseUrl, userVerificationToken).sendVerificationEmail()

  const jsonUser = user.toJSON()
  delete jsonUser.password
  res
    .status(201)
    .json(new ApiResponse(201, {  }, "A verification email is sent!"));
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, gender, email, number } = req.body;
  const file = req.file;
  let user = req.user;
  let profilePicture;

  if (id != req?.user?.id) {
    throw new ApiError(
      400,
      "You are not authorized to update this user's data!"
    );
  }

  if (file) {
    const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    profilePicture = `/uploads/${filename}`;

    if (user.profileImage) {
      const oldProfileImagePath = path.join(__dirname, "..", user.profileImage);
      fs.unlink(oldProfileImagePath, (err) => {
        if (err) console.error("Error deleting old profile picture:", err);
      });
    }

    // Save the new profile image to disk
    const filePath = path.join(__dirname, '../uploads/', filename);
    fs.writeFileSync(filePath, file.buffer);
  }

  await user.update({
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    gender: gender || user.gender,
    email: email || user.email,
    number: number || user.number,
    profileImage: profilePicture || user.profileImage,
  });
  res
    .status(200)
    .json(new ApiResponse(200, { user: user }, "User updated successfully!"));
});

const getuser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  let user = req.user;
  if (id != user?.id) {
    throw new ApiError(
      400,
      "You are not authoried to access this user's data!"
    );
  }
  if (!user) {
    throw new ApiError(400, "User doesn't exist");
  }
  res.status(200).json(new ApiResponse(200, { user: removePassword(user) }, "User data"));
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  let user = await User.scope("withPassword").findOne({
    where: { email: email },
    attributes: { exclude: ["refreshToken"] },
  });
  if (!user) {
    throw new ApiError(400, "Invalid email or passowrd");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid email or passowrd");
  }
  
  if(!user.verified){
    throw new ApiError(400, "Please verify your account");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?.uuid
  );
  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: removePassword(user),
        token: {
          accessToken,
          refreshToken,
        },
      },
      "User logged in seccessfully"
    )
  );
});

const userLogout = asyncHandler(async (req, res) => {
  try {
    await User.update(
      { refreshToken: null },
      {
        where: {
          uuid: req.user.uuid,
        },
      }
    );
    res
      .status(200)
      .json(new ApiResponse(200, {}, "User logged out successfully!"));
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  let { refreshToken } = req.body;
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is not provided");
  }
  let decodedRefreshToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  let user = await User.findOne({ where: { uuid: decodedRefreshToken?.uuid } });
  if (refreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Invalid token");
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user.uuid);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      },
      "Tokens generated successfully!"
    )
  );
});

const changePassword = asyncHandler(async (req, res) => {
  let { currentPassword, newPassword, confirmPassword } = req.body;
  const isPasswordValid = await bcrypt.compare(currentPassword, req.user.password)
  if (!isPasswordValid) {
    throw new ApiError(400, "Current password is incorrect");
  }
  if(newPassword !== confirmPassword){
    throw new ApiError(400, "Passwords does not match!");
  }

  const hashedPassword = await bcrypt.hash(confirmPassword, 10);
  await req.user.update({
    password: hashedPassword
  })
  res.status(200).json(new ApiResponse(200, {user: removePassword(req.user)}, "Password changed successfully"))
})

const forgotPassword = asyncHandler(async (req, res) => {
  const {email} = req.body;

  const user = await User.findOne({where: {email: email}})
  if(!user){
    throw new ApiError(404, "User doesn't exist")
  }

  const resetToken = createPasswordResetToken(user);
  await user.save()

  const baseUrl = `${req.protocol}://${req.get('host')}/`
  // const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/reset-password/${resetToken}`
  // const message = `Please click the url: ${resetURL}. Valid for 10 minutes only.`

  // await sendEmail({
  //   email: user.email,
  //   subject: 'Reset your password',
  //   message: message
  // })

  await new Email(user, baseUrl, resetToken).sendResetEmail()

  res.status(200).send(new ApiResponse(200, {}, 'Please check your email to reset the password'))
})

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body

  if(!token){
    throw new ApiError(400, "Token is not provided!")
  }
  const hashedToken = getCryptoEncryptedToken(token)
  const user = await User.findOne({where: {passwordResetToken: hashedToken, resetTokenExpire: {
    [Op.gt]: Date.now(),
  },}})

  if(!user){
    throw new ApiError(400, 'Invalid token')
  }

  if(newPassword !== confirmPassword){
    throw new ApiError(400, 'Passwords does not match')
  }
  const hashedPassword = await bcrypt.hash(confirmPassword, 10);
  await user.update({
    password: hashedPassword,
    passwordResetToken: null,
    resetTokenExpire: null
  })
  res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"))
})

const verifyRegistration = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if(!token){
    throw new ApiError(400, "Token is not provided!")
  }
  const hashedToken = getCryptoEncryptedToken(token)

  const user = await User.findOne({where: {verificationToken: hashedToken}})

  if(!user){
    throw new ApiError(400, 'Invalid token')
  }

  await user.update({
    verified: true,
    verificationToken: null
  })
  res.status(200).json(new ApiResponse(200, {user}, "User verified successfully"))
})

module.exports = {
  getusers,
  createUser,
  getuser,
  userLogin,
  userLogout,
  refreshAccessToken,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyRegistration
};
