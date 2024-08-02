const express = require("express");
const { getusers, createUser, getuser, userLogin, userLogout, refreshAccessToken, updateUser } = require("../controllers/userController");
const { verifyJwt } = require("../middlewares/authMiddleware");
const router = express.Router()

router.post('/create', createUser)
router.put('/update/:id', verifyJwt, updateUser)
router.get("/list", getusers)
router.get("/auth/logout", verifyJwt, userLogout)
router.post("/auth/login", userLogin)
router.post("/auth/refresh-token", refreshAccessToken)
router.get("/:id", verifyJwt, getuser)

module.exports = router;