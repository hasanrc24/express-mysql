const express = require("express");
const { getusers, createUser, getuser, userLogin, userLogout } = require("../controllers/userController");
const { verifyJwt } = require("../middlewares/authMiddleware");
const router = express.Router()

router.post('/create', createUser)
router.get("/list", getusers)
router.get("/logout", verifyJwt, userLogout)
router.post("/login", userLogin)
router.get("/:id", verifyJwt, getuser)

module.exports = router;