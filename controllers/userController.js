const bcrypt = require('bcrypt');
const db = require("../models");
const { generateAccessAndRefreshToken } = require('../utils/utils');
const jwt = require("jsonwebtoken")

const User = db.User

const removePassword = (user) => {
  const userData = user.get({ plain: true });
  delete userData.password;
  return userData;
};

const getusers = async (req, res) => {
    try {
        let users = await User.findAll({})
        res.status(200).json({
            users: users
        })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

const createUser = async (req, res) => {
    const { firstName, lastName, gender, email, password, number } = req.body;

    if (!firstName || !lastName || !gender || !email || !password || !number) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        let existingUser = await User.findAll({where : {email: email}})
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = {
            firstName,
            lastName,
            gender,
            email,
            password: hashedPassword,
            number
        };
        const user = await User.create(newUser)
        res.status(201).json({ message: 'User created successfully', user: user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Database error', error: error });
    }
}

const getuser = async (req, res) => {
    const id = req.params.id
    try {
        let user = await User.findOne({where: {id: id}, attributes: { exclude: ['refreshToken'] }})
        if(!user){
            return res.status(404).json({
                message: "User doesn't exist"
            })
        }
        res.status(200).json({
            user: user
        })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.scope('withPassword').findOne({where : {email: email}, attributes: { exclude: ['refreshToken']}})
        if (!user) {
          return res.status(400).json({
            message: "Invalid credentials"
          });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid credentials"
          });
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?.uuid)
        res.status(200).json({
            user: removePassword(user),
            token: {
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

const userLogout = async (req, res) => {
    try {
        await User.update(
            {refreshToken: null},
            {
                where: {
                    uuid: req.user.uuid
                }
            }
        )
        res.status(200).json({message: "User logged out successfully!"})
    } catch (error) {
        res.status(500).json({message: "Something went wrong"})
    }
}

const refreshAccessToken = async (req, res) => {
    let {refreshToken} = req.body;
    if(!refreshToken){
        return res.status(401).json({message: "Refresh token is not provided"})
    }
    try {
        let decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        let user = await User.findOne({where: {uuid: decodedRefreshToken?.uuid}});
        if(refreshToken !== user?.refreshToken){
            return res.status(401).json({message: "Invalid refresh token"})
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user.uuid)
        
        res.status(200).json({
            message: "Refresh token generated successfully!",
            tokens: {
                accessToken,
                refreshToken: newRefreshToken
            }
        })
    } catch (error) {
        res.status(401).json({message: "Invalid refresh token"})
    }
}

module.exports = { getusers, createUser, getuser, userLogin, userLogout, refreshAccessToken }