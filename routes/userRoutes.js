const express = require("express");
const { getusers, createUser, getuser, userLogin, userLogout, refreshAccessToken, updateUser, changePassword } = require("../controllers/userController");
const { verifyJwt } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/imageMiddleware");
const { multerErrorHandler } = require("../utils/utils");
const { validateUserCreation, validatePasswordChange } = require("../middlewares/userValidationMiddleware");
const router = express.Router()

router.post('/create', upload, multerErrorHandler, validateUserCreation, createUser)
router.put('/update/:id', verifyJwt, upload, multerErrorHandler, updateUser)
router.get("/list", verifyJwt, getusers)
router.put("/change-password", verifyJwt, validatePasswordChange, changePassword)
router.get("/auth/logout", verifyJwt, userLogout)
router.post("/auth/login", userLogin)
router.post("/auth/refresh-token", refreshAccessToken)
router.get("/:id", verifyJwt, getuser)

module.exports = router;