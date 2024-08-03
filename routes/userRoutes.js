const express = require("express");
const { getusers, createUser, getuser, userLogin, userLogout, refreshAccessToken, updateUser } = require("../controllers/userController");
const { verifyJwt } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/imageMiddleware");
const router = express.Router()

router.post('/create', upload.single('profileImage'), createUser)
router.put('/update/:id', verifyJwt, upload.single('profileImage'), updateUser)
router.get("/list", verifyJwt, getusers)
router.get("/auth/logout", verifyJwt, userLogout)
router.post("/auth/login", userLogin)
router.post("/auth/refresh-token", refreshAccessToken)
router.get("/:id", verifyJwt, getuser)

module.exports = router;